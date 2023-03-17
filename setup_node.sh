#!/bin/bash

# install go
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.20.2.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
go version

./scripts/configure_dev.sh
./scripts/buildtools/install_buildtools.sh
make install
