
# Install and start mongodb
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start

# Import db
echo "Loading up the db"
mongorestore --host localhost:27017 --drop /vagrant/dc-campaign-finance-mongodatabase

#Intall Redis
sudo add-apt-repository ppa:chris-lea/redis-server
sudo apt-get update

cd /vagrant
echo "Installing local node modules"
npm install
echo "To start the server run: vagrant ssh -c 'cd /vagrant && npm run dev'"

