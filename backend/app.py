import os
import json
from flask import Flask, render_template, request, redirect, url_for
from flask_cors import CORS
from flask_pymongo import PyMongo
from json import dumps
import jwt

app = Flask(__name__)
CORS(app)

# Mongo setup, connect to the db
# app.config["MONGO_URI"] = "mongodb://localhost:27017/angular-flask-muckaround"
app.config["MONGO_URI"] = "mongodb://jajac:databasepassword@coen-townson.me:27017/angular-flask-muckaround?authSource=admin"
mongo = PyMongo(app)

@app.route('/start', methods=['GET', 'POST'])
def send_data():
    errors = []
    results = {}
    data = json.loads(request.data.decode())
    first_name = data["name"]
    colour = data["colour"]
    try:
        mongo.db.people.insert_one({"name" : first_name,
                                    "colour": colour})
    except:
        print("Errors... :-(")
        errors.append("Couldn't get text")

    return dumps({
        'first_name' : first_name,
        'colour': colour
    })


@app.route('/login', methods= ['POST'])
def process_login():
    email = request.form.get("email")
    password = request.form.get("password")
    token = ""
    user = mongo.db.users.find_one({"email": email, "password": password})
    # TODO: set the token properly with jwt
    if user != None:
        token = email

    return {
        "email": email,
        "token": token
    }

if __name__ == '__main__':
    app.run(port=8001, debug=True)