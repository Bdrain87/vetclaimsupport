#!/bin/sh

set -e

echo "=== Capacitor: Installing Node.js dependencies for SPM resolution ==="
echo "Current directory: $(pwd)"
echo "CI_PRIMARY_REPOSITORY_PATH: $CI_PRIMARY_REPOSITORY_PATH"

if ! command -v brew > /dev/null 2>&1; then
  echo "Homebrew not found, skipping Node.js install"
else
  if ! command -v node > /dev/null 2>&1; then
    echo "Node.js not found, installing via Homebrew..."
    brew install node
  fi
fi

echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

cd "$CI_PRIMARY_REPOSITORY_PATH"
echo "Working directory: $(pwd)"
echo "package.json exists: $(test -f package.json && echo yes || echo no)"

echo "Installing npm dependencies..."
npm install --prefer-offline || npm install

echo "Verifying Capacitor plugin packages exist..."
ls -d node_modules/@capacitor/haptics node_modules/@capacitor/keyboard node_modules/@capacitor/splash-screen node_modules/@capacitor/status-bar 2>&1 || true

echo "=== Capacitor: node_modules ready for SPM package resolution ==="
