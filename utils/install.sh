#!/bin/bash

# Help features
if [ "$1" = "-h" ] || [ "$1" = "--help" ]
then
    echo "Usage: install.sh [OPTION]"
    echo "  -b,         Only install backend requirements"
    echo "  -h, --help  Show help options"
    exit 0
fi

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
