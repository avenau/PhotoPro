import os
import json
from flask import Flask, render_template, request, redirect, url_for
from flask_cors import CORS
from flask_pymongo import PyMongo
from json import dumps

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

# Test
@app.route('/login', methods= ['POST'])
def process_login():
    data = json.loads(request.data.decode())
    email = data["loginEmail"]
    password = data["loginPassword"]
    print(email + " " + password)
    loggedIn = False

    
    doc = mongo.db.users.find_one({"email": email, "password": password})
    if doc == None:
        print("email: " + email + " password: " + password + " is not in the database")
    else:
        print("email: " + email + " password: " + password + " was found in the database")
        loggedIn = True

    return dumps({
        'email' : email,
        'password': password,
        'loggedIn': loggedIn
    })
    
    # 

@app.route('/gallery', methods= ['GET'])
def render_gallery():
    return "<p> You logged in <p>"

if __name__ == '__main__':
    app.run(port=8001, debug=True)