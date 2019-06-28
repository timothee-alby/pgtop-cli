FROM node:10.16-alpine

RUN echo "@edge http://nl.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
    apk update && \
    apk add "postgresql@edge<11.4"

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

COPY . .
