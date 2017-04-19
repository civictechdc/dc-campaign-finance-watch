
### Status
[![Build Status](https://travis-ci.org/codefordc/dc-campaign-finance-watch.png)](https://travis-ci.org/codefordc/dc-campaign-finance-watch/)
# DC Campaign Finance Watch

This project is aimed at providing greater transparency to local DC election finances, 
which have historically been pretty opaque.  
The project provides an open API for querying the data as well as a front end that provides visualizations of the data 
and is eay to compare multiple campaigns.

All of our data is pulled from the [Office of Campaign Finance](http://ocf.dc.gov/)

The site is very much in a beta status, so if you notice any issues or have any suggestions please open a ticket.

## Development (Docker or Local)
The data is stored in several MongoDB collections on which an express based RESTish API sits and is run on AWS EC2.  
The front end is built with React and is run through github pages

### 1. Fork the repo
Visit https://github.com/codefordc/dc-campaign-finance-watch repo.

In the top-right corner of the repo, click Fork
[Github Help](https://help.github.com/articles/fork-a-repo/)

### 2. Clone the repo and access on your local
```
git clone https://github.com/<your github username>/dc-campaign-finance-watch
cd dc-campaign-finance-watch
```
#### 3a. Continue the following to use docker or skip to 3b for local, non docker config
### Install Docker and Docker Compose
Get [Docker](https://www.docker.com/products/overview)
Download and Install docker based on your current system.

Get [Docker-Compose](https://docs.docker.com/compose/install/)
Download and Install docker-compose based on your current system.

The following assume that you've install docker and docker-compose on your current system.

#### Setup front end development on docker machine
This will run a local instance of the frontend that will talk to the public API.  
Any changes you make to source files should be automatically reloaded in the browser.
``` 
docker-compose up dc-campaign-finance-ui
```
#### 3b. Setup front end development on local machine
Install [Node Version Manager](https://github.com/creationix/nvm#installation)

With nvm installed, execute:
```
nvm install 6.10.2
nvm use 6.10.2
```
Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)

With the above node version set and yarn installed, execute:
```
yarn
```
After npm install complete, execute:
```
yarn start
```

Visit [DC Campaign Finance Local App](http://localhost:3001/) to see running app.

## Working on the backend API
#### Docker development env
This will start a mongodb and seed it with dc-campaign-finance-mongodatabase.zip content.
Each call to mongo-seed will drop the existing database.
``` 
docker-compose up mongo-seed
```
The following assume that you've seeded your mongodb. It will start a web app connected to your local api.
``` 
docker-compose up dc-campaign-finance-api
```

Visit [DC Campaign Finance Local App](http://localhost:3001/) to see running app.


#### Docker production env
This will run a production instance of the frontend that will talk to the public API.  
```
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d

```

## Contributing
Contributions are always welcome!  We are in the process of pulling together a checklist for submitting a PR, but for now the only thing to keep in mind is to avoid adding a PR with linting errors.  There is an .eslintrc file included in the repo that should help out with that.
