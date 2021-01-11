FROM node:14-alpine3.10

RUN echo "@edge http://nl.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
    apk update && \
    apk add "postgresql@edge<11.4" && \
    apk add postgresql-client && \
    apk add python make gcc g++

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

COPY . .
