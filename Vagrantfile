# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu14.04"
  config.vm.box_url = "http://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"

  # Network config.
  config.vm.hostname = "dccampaignfinance"
  config.vm.network "private_network", ip: "192.168.50.4"

  config.vm.provision :shell, :inline => <<-SH
    sudo apt-get update
    sudo apt-get install -y nodejs npm mongodb

    # Configure mongo. The only real option that needs to be
    # set is textSearchEnabled=true for versions of Mongo
    # before 2.6, but let's be specific with the rest since
    # we're writing the whole configuration file.
    cat <<EOF | sudo tee /etc/mongodb.conf > /dev/null
dbpath=/var/lib/mongodb
logpath=/var/log/mongodb/mongodb.log
logappend=true
bind_ip = 127.0.0.1
port = 27017
journal=false
noauth = true
verbose = true
setParameter=textSearchEnabled=true
EOF

    # Start mongo.
    sudo /etc/init.d/mongodb restart

    # Restore data.
    echo Loading database...
    mongorestore --host localhost:27017 --drop /vagrant/dc-campaign-finance-mongodatabase

    # Change to the directory that maps to this directory,
    # so we can run the source code that's check out directly.
    cd /vagrant

    # Install packages.
    npm install
    npm install -g supervisor
    supervisor server.js

SH
end
