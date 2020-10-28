#!/bin/bash

cd backend

export FLASK_APP=fs_api.py
export FLASK_ENV=development
export BACKEND_PORT=8101

# Host 0.0.0.0 is just for the server, you can run host=127.0.0.1 locally
# Only need to be in venv when installing new packages
env/bin/python3 -m flask run --host=0.0.0.0 --port=8101
