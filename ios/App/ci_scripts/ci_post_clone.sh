#!/bin/sh

set -e

echo "=== Capacitor: Installing Node.js dependencies for SPM resolution ==="

if ! command -v node > /dev/null 2>&1; then
  echo "Node.js not found, installing via Homebrew..."
  brew install node
fi

echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

cd "$CI_PRIMARY_REPOSITORY_PATH"

echo "Installing npm dependencies..."
npm ci

echo "=== Capacitor: node_modules ready for SPM package resolution ==="
