#!/usr/bin/env bash
set -e
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR/backend"
export PORT=5001
export FRONTEND_DIR="$ROOT_DIR/V2/frontend"
echo "Grab&Go V2 (Queue Buster) — starting server on http://localhost:5001"
echo "(using the shared backend at $ROOT_DIR/backend)"
node server.js
