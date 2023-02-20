#!/bin/bash

CURRENT_DIR="$(pwd)"
BACKEND_PORT=3000
WEB_PORT=3001

echo "Configuring backend environment variables..."
cd packages/backend
rm -rf .env
echo "
PORT=$BACKEND_PORT
WEB_APP_URL=https://$CODESPACE_NAME-$BACKEND_PORT.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
APP_ENV=development
POSTGRES_DATABASE=automatisch
POSTGRES_PORT=5432
POSTGRES_HOST=postgres
POSTGRES_USERNAME=automatisch_user
POSTGRES_PASSWORD=automatisch_password
ENCRYPTION_KEY=sample_encryption_key
WEBHOOK_SECRET_KEY=sample_webhook_secret_key
APP_SECRET_KEY=sample_app_secret_key
REDIS_HOST=redis" >> .env
cd $CURRENT_DIR

echo "Configuring web environment variables..."
cd packages/web
rm -rf .env
echo "
PORT=$WEB_PORT
REACT_APP_GRAPHQL_URL=https://$CODESPACE_NAME-$BACKEND_PORT.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN/graphql
REACT_APP_NOTIFICATIONS_URL=https://notifications.automatisch.io
" >> .env
cd $CURRENT_DIR

echo "Installing and linking dependencies..."
yarn
yarn lerna bootstrap

echo "Migrating database..."
cd packages/backend
yarn db:migrate
yarn db:seed:user

echo "Done!"