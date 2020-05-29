#!/bin/bash

errors=$(standard app/*/*.js)
totalErrors=$(echo "$errors"|wc -l)
echo "$errors"|cut -d: -f1|sort|uniq
echo "$totalErrors errors"
