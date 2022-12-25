# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /automatisch

RUN apk --no-cache add --virtual build-dependencies python3 build-base

COPY ./entrypoint.sh /entrypoint.sh

RUN yarn global add @automatisch/cli@0.3.0

RUN apk del build-dependencies python3 build-base

EXPOSE 3000
ENTRYPOINT ["sh", "/entrypoint.sh"]
