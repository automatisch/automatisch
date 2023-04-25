# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /automatisch

RUN \
  apk --no-cache add --virtual build-dependencies python3 build-base && \
  yarn global add @automatisch/cli@0.6.1 --network-timeout 1000000 && \
  rm -rf /usr/local/share/.cache/ && \
  apk del build-dependencies

COPY ./entrypoint.sh /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["sh", "/entrypoint.sh"]
