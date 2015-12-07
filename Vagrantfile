# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  # Network config.
  config.vm.hostname = "dccampaignfinance"

  config.vm.network "forwarded_port", guest: 3001, host: 3001

  config.vm.provision :shell, path: "vagrant_provisioner.sh"
end
