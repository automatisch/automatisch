#!/bin/sh

set -e

if [ ! -f /automatisch/storage/.env ]; then
  >&2 echo "Saving environment variables"
  ENCRYPTION_KEY="${ENCRYPTION_KEY:-$(openssl rand -base64 36)}"
  WEBHOOK_SECRET_KEY="${WEBHOOK_SECRET_KEY:-$(openssl rand -base64 36)}"
  APP_SECRET_KEY="${APP_SECRET_KEY:-$(openssl rand -base64 36)}"
  echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" >> /automatisch/storage/.env
  echo "WEBHOOK_SECRET_KEY=$WEBHOOK_SECRET_KEY" >> /automatisch/storage/.env
  echo "APP_SECRET_KEY=$APP_SECRET_KEY" >> /automatisch/storage/.env
fi

# initiate env. vars. from /automatisch/storage/.env file
export $(grep -v '^#' /automatisch/storage/.env | xargs)

# migration for webhook secret key, will be removed in the future.
if [[ -z "${WEBHOOK_SECRET_KEY}" ]]; then
  WEBHOOK_SECRET_KEY="$(openssl rand -base64 36)"
  echo "WEBHOOK_SECRET_KEY=$WEBHOOK_SECRET_KEY" >> /automatisch/storage/.env
fi

echo "Environment variables have been set!"
echo "Now running sh /entrypoint.sh functions from this script"

cd /automatisch/packages/backend
if [ "$APP_ENV" = "development" ]; then
  if [ -n "$WORKER" ]; then
    yarn worker
  else
    yarn db:migrate
    yarn db:seed:user
    yarn dev
    cd /automatisch/packages/web
    yarn dev
  fi
else
  if [ -n "$WORKER" ]; then
    yarn start:worker
  else
    yarn db:migrate
    yarn db:seed:user
    yarn start
  fi
fi
