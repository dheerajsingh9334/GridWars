#!/bin/bash
set -e
echo "Installing all dependencies (including dev)..."
npm install
echo "Compiling TypeScript..."
npm run build
echo "Pruning production dependencies..."
npm prune --production
echo "Build complete!"
