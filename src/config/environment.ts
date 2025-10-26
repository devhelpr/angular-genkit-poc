import { config } from 'dotenv';
import { join } from 'node:path';

// Load environment variables from multiple sources
function loadEnvironmentVariables() {
  try {
    // Load from .env.local first (highest priority)
    config({ path: join(process.cwd(), '.env.local') });

    // Load from .env (fallback)
    config({ path: join(process.cwd(), '.env') });

    console.log('Environment variables loaded successfully');
    console.log('GOOGLE_GENAI_API_KEY:', process.env['GOOGLE_GENAI_API_KEY'] ? 'Set' : 'Not set');
    console.log('GENKIT_ENV:', process.env['GENKIT_ENV'] || 'Not set');
  } catch (error) {
    console.error('Error loading environment variables:', error);
  }
}

// Load environment variables immediately
loadEnvironmentVariables();

export { loadEnvironmentVariables };
