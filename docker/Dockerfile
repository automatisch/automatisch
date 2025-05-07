# syntax=docker/dockerfile:1
FROM node:22.15.0-alpine

ENV PORT=3000

RUN \
  apk --no-cache add --virtual build-dependencies python3 build-base git make g++

WORKDIR /automatisch

# copy the app, note .dockerignore
COPY . /automatisch

RUN cd packages/web && yarn

RUN cd packages/web && yarn build

RUN cd packages/backend && yarn --production

RUN \
  rm -rf /usr/local/share/.cache/ && \
  apk del build-dependencies

COPY ./docker/entrypoint.sh /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["sh", "/entrypoint.sh"]
