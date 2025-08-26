#!/bin/bash

# Vercel build script for Route93
# This script ensures proper build order and error handling

set -e  # Exit on any error

echo "🚀 Starting Route93 build for Vercel..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are we in the right directory?"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
yarn install --frozen-lockfile

# Generate Prisma client
echo "🔧 Generating Prisma client..."
yarn rw prisma generate

# Generate GraphQL types
echo "📝 Generating GraphQL types..."
yarn rw g types

# Build the application
echo "🏗️  Building application..."
yarn rw build

# Verify build outputs
echo "✅ Verifying build outputs..."
if [ ! -d "web/dist" ]; then
    echo "❌ Error: web/dist directory not found"
    exit 1
fi

if [ ! -d "api/dist" ]; then
    echo "❌ Error: api/dist directory not found"
    exit 1
fi

echo "🎉 Build completed successfully!"
