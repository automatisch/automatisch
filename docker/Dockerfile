# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /automatisch

RUN apt-get update && apt-get install -y postgresql-client
COPY ./entrypoint.sh /entrypoint.sh

RUN yarn global add @automatisch/cli@0.2.0

EXPOSE 3000
ENTRYPOINT /entrypoint.sh
