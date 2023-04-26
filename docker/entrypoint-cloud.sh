#!/bin/sh

set -e

if [ -n "$WORKER" ]; then
  yarn automatisch start-worker
else
  yarn automatisch start
fi
