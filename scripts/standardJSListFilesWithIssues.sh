#!/bin/bash

errors=$(standard --fix app/*/*.js app/*.js)
totalErrors=$(echo "$errors"|wc -l)
echo "$errors"|cut -d: -f1|sort|uniq
echo "$totalErrors errors"
