#!/bin/bash

cd frontend

if ! [ -e build ]
then
  echo "Production build does not exist, please run the build script first :)"
  exit 1
fi

echo "var BACKEND_PORT = $2;" > build/config.js
npx serve -s build -l $1