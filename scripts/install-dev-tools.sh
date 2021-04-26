#!/bin/bash
cat scripts/setVscodePath.sh >> ~/.bashrc
sudo apt update
sudo apt install jq -y
sudo npm install -g firebase-tools
