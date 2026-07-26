#!/bin/sh
set -e

echo "Running database migrations..."
bun run migrate:db

echo "Seeding database..."
bun run seed:db

echo "Starting server..."
exec bun .output/server/index.mjs
