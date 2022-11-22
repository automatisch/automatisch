# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /automatisch

COPY ./entrypoint.sh /entrypoint.sh

RUN yarn global add @automatisch/cli@0.2.0

EXPOSE 3000
ENTRYPOINT /entrypoint.sh
