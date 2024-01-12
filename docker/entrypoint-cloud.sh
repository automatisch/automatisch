#!/bin/sh

set -e

cd packages/backend

if [ -n "$WORKER" ]; then
  yarn start:worker
else
  yarn start
fi
