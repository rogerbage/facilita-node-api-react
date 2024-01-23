FROM node:18

WORKDIR /facilitaApi
COPY package.json .
RUN yarn install
COPY . .
CMD yarn start:dev
