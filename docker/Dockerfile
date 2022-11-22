# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /automatisch

RUN apt-get update && apt-get install -y dos2unix

COPY ./entrypoint.sh /entrypoint.sh
RUN dos2unix /entrypoint.sh && apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*

RUN yarn global add @automatisch/cli@0.2.0

EXPOSE 3000
ENTRYPOINT ["sh", "/entrypoint.sh"]
