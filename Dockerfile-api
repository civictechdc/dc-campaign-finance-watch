FROM node:boron
# Create app directory and define work dir for api
WORKDIR /usr/src/dc-campaign-finance-watch/api

# Install app dependencies
COPY package.json .
RUN yarn install

# Copy the contents of current directory to work dir
COPY . .

CMD ["npm", "run", "dev"]
