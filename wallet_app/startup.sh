#!/bin/bash

export ALGORAND_DATA=/proj/ove-PG0/murray/node/n$1
goal node restart -p "10.10.1.11:4161"
node wallet_test.js ./node$1.json test$1
