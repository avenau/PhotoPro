#!/bin/bash

# Help features
if [ "$1" = "-h" ] || [ "$1" = "--help" ]
then
    echo "Usage: run_back.sh [PORT] [SHOWDOWN-LENGTH]"
    echo "  -h, --help  Show help options"
    exit 0
fi

cd backend

export FLASK_APP=app.py
export FLASK_ENV=production
export BACKEND_PORT=$1
export SHOWDOWN_LENGTH=$2

# Host 0.0.0.0 is just for the server, you can run host=127.0.0.1 locally
# Only need to be in venv when installing new packages
env/bin/python3 -m flask run --host=0.0.0.0 --port=$1
