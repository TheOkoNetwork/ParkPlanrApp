#!/bin/bash

standard app/*/*.js|cut -d: -f1|sort|uniq
