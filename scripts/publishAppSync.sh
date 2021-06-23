#!/bin/bash

dirname=$(dirname $0)
version="$(node $dirname/get-version.js)"
echo "Current app version: ${version}"
nativescript-app-sync release "ParkPlanr Android" android --targetBinaryVersion "$version" --mandatory