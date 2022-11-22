# syntax=docker/dockerfile:1

FROM alpine

COPY ./entrypoint.sh /entrypoint.sh

RUN apk add --no-cache dos2unix && \
    dos2unix /entrypoint.sh

FROM node:16-alpine
WORKDIR /automatisch

COPY --from=0 /entrypoint.sh /entrypoint.sh

RUN yarn global add @automatisch/cli@0.2.0

EXPOSE 3000
ENTRYPOINT ["sh", "/entrypoint.sh"]
