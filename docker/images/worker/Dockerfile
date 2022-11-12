# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /automatisch

RUN apt-get update && apt-get install -y postgresql-client

COPY ./wait-for-postgres.sh /automatisch/wait-for-postgres.sh

RUN yarn global add @automatisch/cli@0.2.0
CMD sh /automatisch/wait-for-postgres.sh automatisch start-worker --env-file /automatisch/storage/.env
