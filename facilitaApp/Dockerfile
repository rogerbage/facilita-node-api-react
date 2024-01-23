FROM node:18

WORKDIR /facilitaApp
COPY package.json .
RUN yarn install
COPY . .
CMD yarn start
