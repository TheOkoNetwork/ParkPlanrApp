#!/bin/bash

dirname=$(dirname $0)
cd $dirname/../

echo "Removing package-lock.json"
rm -rf package-lock.json

echo "Removing node modules"
rm -rf node_modules

echo "NPM installing"
npm install
