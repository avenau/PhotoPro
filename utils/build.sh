#!/bin/bash

if ! [ -e backend/env -a -e frontend/node_modules ]
then
  echo "Dependencies not installed, please run the install script first :)"
  exit 1
fi

cd frontend
npm run build