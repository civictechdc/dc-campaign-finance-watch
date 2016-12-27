
### Status
[![Build Status](https://travis-ci.org/codefordc/dc-campaign-finance-watch.png)](https://travis-ci.org/codefordc/dc-campaign-finance-watch/)
# DC Campaign Finance Watch

This project is aimed at providing greater transparency to local DC election finances, which have historically been pretty opaque.  The project provides an open API for querying the data as well as a front end that provides visualizations of the data and is eay to compare mulitple campaigns.

All of our data is pulled from the [Office of Campaign Finance](http://ocf.dc.gov/)

The site is very much in a beta status, so if you notice any issues or have any suggestions please open a ticket.

## Development
The data is stored in several MongoDB collections on which an express based RESTish API sits and is run on AWS EC2.  The front end is built with React and is run through github pages.

```
git clone https://github.com/codefordc/dc-campaign-finance-watch
cd dc-campaign-finance-watch
```

### Working on the front end
Since the backend code is publicly available a backend does not have to be running locally in order to contribtue to the front end of the site.

After cloning the repo, run the following commands from directory it was cloned into:
```
npm install
npm start
```
This will run a local instance of the frontend that will talk to the public API.  Any changes you make to source files should be automatically reloaded in the browser.

### Docker
Get [Docker](https://www.docker.com/products/overview)
Download and Install docker based on your current system.

Get [Docker-Compose](https://docs.docker.com/compose/install/)
Download and Install docker-compose based on your current system.

The following assume that you've install docker and docker-compose on your current system.

#### Docker development env
``` 
docker-compose up
```
Visit [DC Campaign Finance Local App](http://localhost:3001/) to see running app.

#### Docker production env
```
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d

```

### Working on the backend API
#### Docker development env
``` 
docker-compose up api
```

Visit [DC Campaign Finance Local App](http://localhost:3001/) to see running app.
Visit [DC Campaign Finance Local App API](http://localhost:3000/) to see running app.


## Contributing
Contributions are always welcome!  We are in the process of pulling together a checklist for submitting a PR, but for now the only thing to keep in mind is to avoid adding a PR with linting errors.  There is an .eslintrc file included in the repo that should help out with that.
