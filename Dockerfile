FROM node:boron

# Create app directory and define work dir
WORKDIR /usr/src/dc-campaign-finance-watch

# Install app dependencies
COPY package.json .
RUN npm install

# Copy the contents of current directory to work dir
COPY . .

# Start server
CMD ["npm", "start"]
