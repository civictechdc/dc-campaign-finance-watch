#!/usr/bin/env bash
sudo apt-get update

# Install node and npm
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install and start mongodb
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start

# Import db
echo "Loading up the db"
sudo apt-get install unzip
unzip /vagrant/dc-campaign-finance-mongodatabase.zip -d /vagrant/dc-campaign-finance-mongodatabase \
&& mongorestore --host localhost:27017 --drop /vagrant/dc-campaign-finance-mongodatabase

#Intall / Start Redis
sudo add-apt-repository ppa:chris-lea/redis-server
sudo apt-get update
sudo apt-get install -y redis-server
redis-server &

cd /vagrant
echo "Installing local node modules"
npm install
echo "To start the server run: vagrant ssh -c 'cd /vagrant && npm run dev'"

