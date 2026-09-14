#!/usr/bin/env bash
set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR/backend"
export PORT=5000
export FRONTEND_DIR="$ROOT_DIR/frontend"
echo "Grab&Go (V1) — starting server on http://localhost:5000"
node server.js
