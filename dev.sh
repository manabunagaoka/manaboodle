#!/bin/bash

# Kill any existing Next.js processes
echo "🔍 Checking for existing Next.js processes..."
pkill -f "next dev" || true

# Wait a moment for port to be released
sleep 1

# Unset the problematic environment variable
unset RESEND_API_KEY

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 3000 is in use, killing process..."
    kill $(lsof -t -i:3000) || true
    sleep 1
fi

echo "🚀 Starting Next.js dev server..."
npm run dev
