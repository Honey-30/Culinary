#!/bin/bash
# CulinaryLens Backend Startup Script (Unix/Linux/Mac)

echo "==============================================="
echo "   CulinaryLens ML Perception Backend"
echo "==============================================="
echo ""

cd "$(dirname "$0")"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 not found. Please install Python 3.10+"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
if [ ! -d "venv/lib/python*/site-packages/fastapi" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Check environment file
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found, using defaults"
fi

# Start server
echo ""
echo "Starting server at http://localhost:8000"
echo "Press Ctrl+C to stop"
echo ""
python main.py
