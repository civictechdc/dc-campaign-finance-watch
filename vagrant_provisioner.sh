sudo apt-get update

# Install node and npm
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g gulp

# Install and start mongodb
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start

# Import db
echo "Loading up the db"
mongorestore --host localhost:27017 --drop /vagrant/dc-campaign-finance-mongodatabase

cd /vagrant
echo "Run 'gulp serve --env=local' to get started"
