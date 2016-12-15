FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/dc-campaign-finance-watch
WORKDIR /usr/src/dc-campaign-finance-watch

# Install app dependencies
COPY package.json /usr/src/dc-campaign-finance-watch/
RUN npm install

# Bundle app source
COPY . /usr/src/dc-campaign-finance-watch

ENV NODE_ENV=dev

EXPOSE 3001

CMD [ "npm", "start" ]
