#!/bin/sh

set -e

if [ ! -f /automatisch/storage/.env ]; then
  >&2 echo "Saving environment variables"
  ENCRYPTION_KEY="${ENCRYPTION_KEY:-$(openssl rand -base64 36)}"
  APP_SECRET_KEY="${APP_SECRET_KEY:-$(openssl rand -base64 36)}"
  echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" >> /automatisch/storage/.env
  echo "APP_SECRET_KEY=$APP_SECRET_KEY" >> /automatisch/storage/.env
fi

# initiate env. vars. from /automatisch/storage/.env file
export $(grep -v '^#' /automatisch/storage/.env | xargs)

echo "Environment variables have been set!"

sh /entrypoint.sh
