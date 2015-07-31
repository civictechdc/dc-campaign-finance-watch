# dc-campaign-finance-backend

A node.js server for providing a DC Campaign Finance API.

## Running the server

To deploy this project locally you will need to get this code, get the data, set up a local MongoDB database, and then set up our API server.

Get this code:

	git clone https://github.com/codefordc/dc-campaign-finance-watch
	cd dc-campaign-finance-watch

Get the data from anther collaborator. It'll come in the form of a Mongo dump directory called `dc-campaign-finance-mongodatabase`. (It was created using `mongodump --host localhost:27017`.) Put that directory within your `dc-campaign-finance-watch` directory.

Now you can just start up everything with Vagrant:

	sudo apt-get install vagrant virtualbox
	vagrant up

or continue setting up the local service...

Install MongoDB and then start a foregrounded instance of the Mongo server. On Ubuntu 14.04 that's:

	sudo apt-get install mongodb
	mkdir db
	mongod --dbpath db --nojournal --noauth --setParameter textSearchEnabled=true

Continue in a new terminal...

Add this into your local Mongo database:

	mongorestore --host localhost:27017 dc-campaign-finance-mongodatabase/

For the API server, you will need node.js. A good way to do that is via [nvm](https://github.com/creationix/nvm). Once you have node.js set up, do this:

	npm install

	npm install -g supervisor
	supervisor server.js

Then visit [http://localhost:3000/dc-campaign-finance/api](http://localhost:3000/dc-campaign-finance/api). You should see some very basic information about the API we've built, including the current version number of the API.

## API Documentation

All URLs below are relative to the API base path of `/dc-campaign-finance/api`.

### [/candidate](http://localhost:3000/dc-campaign-finance/api/candidate)

Lists all candidates in the data.

