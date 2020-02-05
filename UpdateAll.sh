#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR

echo "Removing package lock"
rm package-lock.json

echo "Removing node_modules"
rm -rf node_modules

#echo "Updating dependencies in package.json"
#ncu -u

echo "Downgrading nativescript-theme-core to 1.0.6, need to fix css imports to work without needing this"
npm install nativescript-theme-core@~1.0.6 --save

echo "Downgrading nativescript-plugin-firebase to 10.2.0 (Hopeful iOS build fix)"
npm install nativescript-plugin-firebase@~10.2.0 --save

echo "Downgrading @nativescript/core to 6.2.3 (iOS compileC oidauth bug fix hopefully)"
npm install @nativescript/core@6.2.3 --save

echo "Installing dependencies"
npm install

#echo "Updating nativescript iOS/Android runtimes and cross platform modules"
#tns update

echo "Downgrading @nativescript/core to 6.2.3 (iOS compileC oidauth bug fix hopefully)"
npm install @nativescript/core@6.2.3 --save

echo "Updating webpack"
./node_modules/.bin/update-ns-webpack --configs

#echo "Preparing android"
#tns prepare android

#echo "Preparing iOS"
#tns prepare ios

