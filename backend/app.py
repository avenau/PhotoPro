import os
import json
from flask import Flask, render_template, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from json import dumps

app = Flask(__name__)
CORS(app)

# Mongo setup, connect to the db
app.config["MONGO_URI"] = "mongodb://localhost:27017/angular-flask-muckaround"
#app.config["MONGO_URI"] = "mongodb://localhost:27017/other-db"
#app.config["MONGO_URI"] = "mongodb://jajac:databasepassword@coen-townson.me:27017/angular-flask-muckaround?authSource=admin"
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

@app.route('/manage_privacy', methods=['GET', 'POST'])
def send_privacy_options():
    errors = []
    results = {}
    data = json.loads(request.data.decode())
#    first_name = data["first_name"]
#    last_name = data["last_name"]
#    age = data["age"]
#    dob = data["dob"]
#    city = data["city"]
#    country = data["country"]
    try:
        mongo.db.privacy_settings.insert_many(data)
    except:
        print("Errors... :-(")
        errors.append("Couldn't get text")

    return dumps({
        "first_name" : first_name,
        "last_name": last_name, 
        "age": age, 
        "dob": dob, 
        "city": city, 
        "country": country
    })

if __name__ == '__main__':
    app.run(port=8001, debug=True)