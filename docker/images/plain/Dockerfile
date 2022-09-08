# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /automatisch

# npm registry for dev purposes
RUN npm config set fetch-retry-maxtimeout 5000
RUN npm config set fetch-retry-mintimeout 3000
RUN npm set registry http://localhost:5000
# npm registry for dev purposes

RUN yarn global add @automatisch/cli
