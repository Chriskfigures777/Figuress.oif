#!/bin/bash

# Build script for Vercel deployment
echo "Starting Vercel build process..."

# Install dependencies
npm ci

# Build the client application
npm run build:client

echo "Build completed successfully!"
