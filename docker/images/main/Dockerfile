# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /automatisch

RUN apt-get update && apt-get install -y postgresql-client
COPY ./wait-for-postgres.sh /automatisch/wait-for-postgres.sh

RUN mkdir -p /automatisch/storage
RUN touch /automatisch/storage/.env
RUN echo "ENCRYPTION_KEY=$(openssl rand -base64 36)" >> /automatisch/storage/.env
RUN echo "APP_SECRET_KEY=$(openssl rand -base64 36)" >> /automatisch/storage/.env
RUN yarn global add @automatisch/cli@0.1.5

EXPOSE 3000
CMD sh /automatisch/wait-for-postgres.sh automatisch start --env-file=/automatisch/storage/.env
