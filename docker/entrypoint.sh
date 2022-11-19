#!/bin/sh

set -e

export PGPASSWORD="$POSTGRES_PASSWORD"

until psql -h "$POSTGRES_HOST" -U "$POSTGRES_USERNAME" -d "$POSTGRES_DATABASE" -c '\q'; do
  >&2 echo "Waiting for Postgres to be ready..."
  sleep 1
done

if [ ! -f /automatisch/storage/.env ]; then
  >&2 echo "Saving environment variables"
  ENCRYPTION_KEY="${ENCRYPTION_KEY:-$(openssl rand -base64 36)}"
  APP_SECRET_KEY="${APP_SECRET_KEY:-$(openssl rand -base64 36)}"
  echo "$ENCRYPTION_KEY
  $APP_SECRET_KEY" > /automatisch/storage/.env
fi

>&2 echo "Postgres is up - executing command"

if [ -n "$WORKER" ]; then
  automatisch start-worker --env-file /automatisch/storage/.env
else
  automatisch start --env-file /automatisch/storage/.env
fi
