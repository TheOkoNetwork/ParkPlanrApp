#!/bin/bash
cat scripts/firebaseLoginCheck.sh >> ~/.bashrc
sudo apt update
sudo apt install jq -y
sudo npm install -g firebase-tools
