#!/bin/bash

# Load environment variables from .env.local if it exists
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Load environment variables from .env if it exists  
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start the development server
npm start