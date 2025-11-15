#!/bin/sh

# Create logs directory
mkdir -p /app/logs

# Start NGINX in background (will run as daemon)
echo "Starting NGINX..."
nginx &
NGINX_PID=$!

# Wait a moment for NGINX to start
sleep 2

# Check if NGINX started
if ! kill -0 $NGINX_PID 2>/dev/null; then
    echo "ERROR: NGINX failed to start"
    exit 1
fi

echo "NGINX started successfully (PID: $NGINX_PID)"

# Start Node.js in foreground (logs will be visible in Dokploy)
echo "Starting Node.js server..."
echo "Node.js will start now..."
exec node dist/server.js
