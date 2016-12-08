
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
npm run serve
```
This will run a local instance of the frontend that will talk to the public API.  Any changes you make to source files should be automatically reloaded in the browser.

### Docker
Visit https://www.docker.com/products/docker-toolbox and download the docker-toolbox for your system.
Install docker-toolbox on your machine.

```
docker-machine start
eval $(docker-machine env)
docker build -t romoy/dc-campaign-finance-watch .

```

### Working on the backend API
The quickest/simplest way to work on the backend code is through [Vagrant](https://www.vagrantup.com/), which creates and sets up a virtual machine that is ready for development.  It can be found [here](https://www.vagrantup.com/downloads.html) or through various package managers.

After installing vagrant, from the directory of source:
```
vagrant up
vagrant ssh -c 'cd /vagrant'
npm start
```

or if you want to run the front end as well

```
npm run serve
```

The alternative to running vagrant is to install the various tools and technologies locally. Due to the variety in OS, this README just lists what will need to be installed

* MongoDB
* NodeJS (version 5)
* Redis

After all the installations are complete run the following:

```
unzip dc-campaign-finance-mongodatabase.zip -d dc-campaign-finance-mongodatabase
mongorestore --host localhost:27017 --drop ./dc-campaign-finance-mongodatabase
npm install -g gulp
npm install
npm start
```

The API will now be running on https://localhost:3000


## Contributing
Contributions are always welcome!  We are in the process of pulling together a checklist for submitting a PR, but for now the only thing to keep in mind is to avoid adding a PR with linting errors.  There is an .eslintrc file included in the repo that should help out with that.
