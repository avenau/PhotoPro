import json
import os
import smtplib
from json import dumps

from flask import Flask, render_template, request, redirect, url_for
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt

import password_reset as password_reset

app = Flask(__name__)
CORS(app)

def defaultHandler(err):
    print(err)
    response = err.get_response()
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.description,
    })
    response.content_type = 'application/json'
    return response

app.register_error_handler(Exception, defaultHandler)

# Mongo setup, connect to the db
app.config["MONGO_URI"] = "mongodb://localhost:27017/angular-flask-muckaround"
# app.config["MONGO_URI"] = "mongodb://jajac:databasepassword@coen-townson.me:27017/angular-flask-muckaround?authSource=admin"
mongo = PyMongo(app)

# Creating email server
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME = "photopro.jajac@gmail.com",
    MAIL_PASSWORD = "photoprodemopassword"
)

# Create BCrypt object to hash and salt passwords
bcrypt = Bcrypt(app)

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
    email = request.values.get("email")

    msg = password_reset.password_reset_request(email, mongo)
    mail = Mail(app)
    mail.send(msg)

    return dumps({})

@app.route('/passwordreset/reset', methods=['POST'])
def auth_passwordreset_reset():
    """ Given a reset code, change user's password """

    email = request.form.get("email")
    reset_code = request.form.get("reset_code")
    new_password = request.form.get("new_password")

    return dumps(
        password_reset.password_reset_reset(email, reset_code, new_password)
    )

@app.route('/login', methods=['GET','POST'])
def login():
    print('In login')
    return dumps({})

@app.route('/accountregistration', methods=['POST'])
def account_registration():

    # TODO
    # ======= Backend validation =======
    # As front end checks could be avoided
    # Make a helper function for backend validation too
    # Backend check on password 10 characters
    # Backend check on email
    # First name
    # Last name


    # Register a new account
    # Get all form values
    firstName = request.form.get("firstName")
    lastName = request.form.get("lastName")
    nickname = request.form.get("nickname")
    password = request.form.get("password")
    email = request.form.get("email")
    privFName = request.form.get("privFName")
    privLastName = request.form.get("privLastName")
    privEmail = request.form.get("privEmail")
    aboutMe = request.form.get("aboutMe")
    DOB = request.form.get('DOB')

    # Make some hashbrowns
    hashedPassword = bcrypt.generate_password_hash(password)

    print(firstName,lastName, email, nickname, password, privFName, privLastName,privEmail)

    # Insert account details into collection called 'user'
    mongo.db.user.insert({'fname': firstName,
                        'lname': lastName,
                        'email': email,
                        'nickname': nickname,
                        'password': hashedPassword,
                        'privFName': privFName,
                        'privLName':  privLastName,
                        'privEmail': privEmail,
                        'aboutMe': aboutMe,
                        'DOB': DOB
                        }
    )

    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(port=8001, debug=True)
