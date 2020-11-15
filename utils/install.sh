#!/bin/bash

backend=0
formatter=0

# Parse args
for arg in $@
do
  if [ "$arg" = "-b" ]
  then
    backend=1
    continue
  fi
  if [ "$arg" = "-f" ]
  then
    formatter=1
    continue
  fi
  if [ "$arg" = "-h" ] || [ "$arg" = "--help" ]
  then
    echo "Usage: install.sh [OPTION]"
    echo "  -b,         Only install backend requirements"
    echo "  -f,         Additionally install formatter"
    echo "  -h, --help  Show help options"
    exit 0
  fi
  if [[ "$arg" =~ ^- ]]
  then
    echo -e "Unknown option $arg\nUse --help or -h for more information." >&2
    exit 1
  fi
done


# Backend environment install
echo "Installing python requirements..."
cd backend
if [ -e env ]
then
  rm -rf env
fi
python3 -m venv env
source env/bin/activate
python3 -m pip install -r requirements.txt
python3 -m pip install -e .
if [ $formatter -eq 1 ]
then
  pip3 install black
fi

if [ $backend -eq 1 ]
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
