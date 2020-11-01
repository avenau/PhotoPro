#!/bin/bash

# Backend environment install
echo "Installing python requirements..."
cd backend
if [ -e env ]
then
  rm -rf env
fi
python3 -m venv env
source env/bin/activate
pip3 install -r requirements.txt
python -m pip install -e .

if [ "$1" = "-b" ]
then
  exit 0
fi

# Frontend environment install
echo "Installing node requirements..."
cd ../frontend
if [ -e node_modules ]
then
  rm -rf node_modules
fi
npm install

echo "Installation complete :)"