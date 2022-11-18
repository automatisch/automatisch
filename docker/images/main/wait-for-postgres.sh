#!/bin/sh

set -e

until psql -h "$POSTGRES_HOST" -U "$POSTGRES_USERNAME" -d "$POSTGRES_DATABASE" -c '\q'; do
  >&2 echo "Waiting for Postgres to be ready..."
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec "$@"
