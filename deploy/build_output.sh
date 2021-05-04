#!/bin/sh
pwd
rm -rf ./output && mkdir ./output

mv build ./output/
cp package.json ./output/