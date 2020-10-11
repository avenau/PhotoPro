import json
import os
import smtplib
from json import dumps

from flask import Flask, render_template, request
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_pymongo import PyMongo
#Added BSON library, needed for ObjectId data type
from bson.objectid import ObjectId
import traceback

import password_reset as password_reset
# from decorator import make_pretty
app = Flask(__name__)
CORS(app)

# Mongo setup, connect to the db
app.config["MONGO_URI"] = "mongodb://localhost:27017/angular-flask-muckaround"
#app.config["MONGO_URI"] = "mongodb://localhost:27017/other-db"
#app.config["MONGO_URI"] = "mongodb://jajac:databasepassword@coen-townson.me:27017/angular-flask-muckaround?authSource=admin"
mongo = PyMongo(app)

# Creating email server
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME = "photopro.jajac@gmail.com",
    MAIL_PASSWORD = "photoprodemopassword"
)

@app.route('/', methods=['GET'])
# @make_pretty
def basic():
    return dumps({
        'first_name' : "test",
        'colour': "test"
    })


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

@app.route('/passwordreset/request', methods=['POST'])
def auth_password_reset_request():
    """
    Given an email address, if the user is a registered user, semd an email
    with a link that they can access temporarily to change their password
    """
    print(request.values.get("email"))
    # data = json.loads(request.args)
    email = request.values.get("email")

    msg = password_reset.password_reset_request(email)
    mail = Mail(app)
    mail.send(msg)

    return dumps({})

@app.route('/passwordreset/reset', methods=['POST'])
def auth_passwordreset_reset():
    """ Given a reset code, change user's password """

    reset_code = request.form.get("reset_code")
    new_password = request.form.get("new_password")

    return dumps(
        password_reset.password_reset_reset(reset_code, new_password)
    )

@app.route('/accountregistration', methods=['POST'])
def account_registration():
    # Register a new account
    
    # Get all the values
    firstName = request.form.get("firstName")
    lastName = request.form.get("lastName")
    email = request.form.get("email")
    nickname = request.form.get("nickname")
    password = request.form.get("password")
    privFName = request.form.get("privFName")
    privLastName = request.form.get("privLastName")
    privEmail = request.form.get("privEmail")

    print(firstName,lastName, email, nickname, password, privFName, privLastName,privEmail)

    return dumps({})
    
@app.route('/manage_account/success', methods=['GET', 'POST'])
def manage_account():
    errors = []
    results = {}
    data = json.loads(request.data.decode())
    #Need Something to Check if current logged in account exist in database
    #I am assuming user_id is stored in localStorage
    #Hard coded this part, this part should check what the logged in user object_id is
    current_user = "5f81131a48ca54daa5e46324"
    try:
        find_userdb = {"_id": ObjectId(current_user)}
        for key, value in data.items():
            if (value == ""):
                continue
            change_userdb = {"$set": { key: value } }
            mongo.db.user.update_one(find_userdb, change_userdb)    
        
    except Exception:
        print("Errors... :-(")
        print (traceback.format_exc())
        errors.append("Couldn't get text")

    return dumps(data)
    
@app.route('/manage_account/confirm', methods=['GET', 'POST'])
def password_check():
    errors = []
    results = {}
    #data = json.loads(request.data.decode())
    #Need Something to Check if current logged in account exist in database
    #I am assuming user_id is stored in localStorage
    #Hard coded this part, this part should check what the logged in user object_id is
    current_user = "5f81131a48ca54daa5e46324"
    data = request.form.to_dict()
    current_password = mongo.db.user.find_one({"_id":ObjectId(current_user)})['password']
    if (current_password == data['password']):
        data['password'] = "true"
    else:
        data['password'] = "false"

    return data


if __name__ == '__main__':
    app.run(port=8001, debug=True)
