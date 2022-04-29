FROM node:16.13.1 AS client
WORKDIR /app
COPY ./client .
RUN npm i
RUN npm run build

