#!/bin/bash
set -e

echo "Deployment started ..."

# Pull the latest version of the app
git pull origin develop

# install libraries
npm install

# create build
npm run build

# delete old build
rm -rf /var/www/html/dev.app.portapporta.webmapp.it/*

#move new build to www
mv dist/pap/* /var/www/html/dev.app.portapporta.webmapp.it/ -f

echo "Deployment finished!"
