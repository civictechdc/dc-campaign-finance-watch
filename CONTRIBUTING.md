# Contributing
Contributions are always welcome!
([See the following emoji key for contribution ideas](https://github.com/kentcdodds/all-contributors#emoji-key))

**Working on your first Pull Request?** You can learn how from this *free* series
[How to Contribute to an Open Source Project on GitHub][egghead]

## Project setup short version

You're going to need [`git`](https://git-scm.com/) to get the project, and [`node`](https://nodejs.org/en/) and
[`yarn`](https://yarnpkg.com/) to install dependencies and run scripts. 
Note: [An extended version of project setup is available.](https://github.com/codefordc/dc-campaign-finance-watch/blob/develop/CONTRIBUTING.md#project-setup-front-end-docker-or-local-extended-version)

1. Fork and clone the repo
2. Run `yarn` in the repo directory to install dependencies
3. Create a branch for your PR
4. Run `yarn start` to start then open app at http://localhost:3001

## Add yourself as a contributor

This project follows the [all contributors][all-contributors] specification. To add yourself to the table of
contributors on the README.md, please use the automated script as part of your PR:

```console
yarn run add <YOUR_GITHUB_USERNAME>
```

Follow the prompt. If you've already added yourself to the list and are making a new type of contribution, you can run
it again and select the added contribution type.

## Communicate

*Second opinion is always important.*

**Bug fixing**. If you have a fix for a bug, please attach your patch in the corresponding issue in the [issue tracker](https://github.com/codefordc/dc-campaign-finance-watch/issues). If there is no entry for the bug yet, then please create a new one. See the Get Ready section below on how to submit your change.

**Improvement and feature request**. If you have an improvement idea, please create an issue in the [issue tracker](https://github.com/codefordc/dc-campaign-finance-watch/issues).

**Task management**. Once the feature idea is agreed upon and translated into concrete actions and tasks, please use the [issue tracker](https://github.com/codefordc/dc-campaign-finance-watch/issues) to create an issue for each individual task. Further technical discussion about the task and the implementation details can be carried out in the issue tracker.

## Get Ready

For your proposed change, you need to have:

* **an issue** (in the issue tracker) which describe your bug or feature
* **a feature branch** in your git fork

### Refer the Issue

The commit message needs to link to the issue. This cross-reference is [very important](http://ariya.ofilabs.com/2012/01/small-scale-software-craftsmanship.html) for the following reasons.

First, the commit log is frozen and can not be changed. If it contains a mistake or outdated information, the log can not be amended. However, further updates can be still posted to the linked issue, which can be followed from the commit log itself.

Second, it provides a placeholder for code review and other feedback.

An example of a bad commit log:

    Fix date change

The above log is too short and useless in the long run. A better version (and note the issue link):
    
    Fetch missing candidate information on date change
    
    https://github.com/codefordc/dc-campaign-finance-watch/issues/207

### Use Feature Branch

To isolate your change, please avoid working on the develop branch. Instead, work on a *feature branch* (often also known as *topic branch*). You can create a new branch (example here crash-fix) off the develop branch by using:

    git checkout -b crash-fix develop

Refer to your favorite Git tutorial/book for further detailed help.

Some good practices for the feature branch:

* Give it a meaningful name, e.g. `prevent-zero-divide`, instead of just `fix`.
* Make *granular* and *atomic* commits, e.g. do not mix a typo fix with some major refactoring.
* Keep one branch for one specific issue. If you need to work on other unrelated issues, create another branch.

## Review and Merge

When your branch is ready, send the pull request.

While it is not always the case, often it is necessary to improve parts of your code in the branch. This is the actual review process.

Here is a check list for the review:

* It does not break the test suite
* The coding style follows the existing one
* There is a reasonable amount of comment based on pull request template.

## Project Setup Front End (Docker or Local) Extended Version
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

## Project Setup Backend
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

