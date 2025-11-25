#!/bin/bash

# Vercel Deployment Script for MindHub
# This script helps you deploy the frontend to Vercel

echo "🚀 MindHub Vercel Deployment Script"
echo "======================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is installed"
echo ""

# Navigate to Frontend directory
cd Frontend

echo "📁 Current directory: $(pwd)"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env file from template..."
    echo ""
    echo "Please set the following environment variable:"
    echo "VITE_API_URL=http://localhost:3000/api"
    echo ""
    read -p "Enter your backend API URL (or press Enter to use localhost): " api_url
    if [ -z "$api_url" ]; then
        api_url="http://localhost:3000/api"
    fi
    echo "VITE_API_URL=$api_url" > .env
    echo "✅ Created .env file"
    echo ""
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "🔑 Please log in to Vercel..."
    vercel login
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Navigate to your project settings"
echo "3. Add environment variable: VITE_API_URL with your backend API URL"
echo "4. Redeploy the project"
echo ""
echo "📖 For more information, see DEPLOYMENT.md"

