import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { expressHandler } from '@genkit-ai/express';
import './config/environment'; // Load environment variables
import { menuSuggestionFlow } from './genkit/menuSuggestionFlow';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.use(express.json());

// Add CORS headers for API routes
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});

// Add debugging middleware
app.use('/api', (req, res, next) => {
  console.log('API Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
  });
  next();
});

// Helper function to extract theme from request
function extractTheme(reqBody: any): string {
  let theme;
  if (reqBody?.theme) {
    // Direct format: {"theme": "italian"}
    theme = reqBody.theme;
  } else if (reqBody?.data?.theme) {
    // Nested format: {"data": {"theme": "italian"}}
    theme = reqBody.data.theme;
  }

  // Check if theme is missing or empty
  if (!theme || theme.trim() === '') {
    // If theme is empty or missing, use a default theme
    theme = 'Italian';
    console.log('No theme provided, using default theme:', theme);
  }

  return theme;
}

// Custom handler for the menu suggestion flow (non-streaming)
app.post('/api/menuSuggestion', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const theme = extractTheme(req.body);
    const result = await menuSuggestionFlow({ theme });
    return res.json(result);
  } catch (error) {
    console.error('Error in menu suggestion:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Streaming handler for the menu suggestion flow
app.post('/api/menuSuggestion/stream', async (req, res) => {
  try {
    console.log('Received streaming request body:', req.body);
    const theme = extractTheme(req.body);

    // Set headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    // For now, we'll simulate streaming by sending the result in chunks
    const result = await menuSuggestionFlow({ theme });
    const text = result.menuItem;

    // Split the text into chunks and send them with delays to simulate streaming
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = i === 0 ? words[i] : ' ' + words[i];
      res.write(chunk);
      // Small delay to simulate streaming
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    res.end();
  } catch (error) {
    console.error('Error in streaming menu suggestion:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
