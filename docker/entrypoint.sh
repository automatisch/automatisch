#!/bin/sh

set -e

if [ -n "$WORKER" ]; then
  automatisch start-worker
else
  automatisch start
fi
