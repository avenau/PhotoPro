cd backend

export FLASK_APP=app.py
# Host 0.0.0.0 is just for the server, you can run host=127.0.0.1 locally
# Only need to be in venv when installing new packages
python3 -m flask run --host=0.0.0.0 --port=8001
