FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

RUN mkdir -p storage

RUN rm -rf /app/storage/*

RUN npm run build

CMD [ "npm", "run", "start" ]