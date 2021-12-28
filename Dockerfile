FROM node:16.13.1-alpine

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN yarn

CMD yarn start
