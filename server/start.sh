#!/bin/sh

# Create logs directory
mkdir -p /app/logs

# Start NGINX in background
echo "Starting NGINX..."
nginx -g 'daemon off;' &
NGINX_PID=$!

# Wait a moment for NGINX to start
sleep 2

# Start Node.js in foreground (logs will be visible in Dokploy)
echo "Starting Node.js server..."
exec node dist/server.js
