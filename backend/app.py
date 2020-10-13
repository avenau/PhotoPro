import os
from json import dumps, loads

from flask import Flask, request, redirect, url_for
from flask_cors import CORS
from flask_mail import Mail
from flask_pymongo import PyMongo
# import jwt
from flask_bcrypt import Bcrypt
from showdown.get_images import get_images
from welcome.contributors import get_popular_contributors_images
from welcome.popular_images import get_popular_images
import password_reset as password_reset
import validate_registration as val_reg

app = Flask(__name__, static_url_path='/static')
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
local_db = "mongodb://localhost:27017/angular-flask-muckaround"
remote_db = """mongodb://jajac:databasepassword@coen-townson.me:27017/
               angular-flask-muckaround?authSource=admin"""
app.config["MONGO_URI"] = local_db
mongo = PyMongo(app)

# Creating email server
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME="photopro.jajac@gmail.com",
    MAIL_PASSWORD="photoprodemopassword",
    PORT_NUMBER=os.getenv("BACKEND_PORT")
)

# Create BCrypt object to hash and salt passwords
bcrypt = Bcrypt(app)


# Test route
@app.route('/', methods=['GET'])
# @make_pretty
def basic():
    return dumps({
        'first_name': "test",
        'colour': "test"
    })


@app.route('/start', methods=['GET', 'POST'])
def send_data():
    errors = []
    # results = {}
    data = loads(request.data.decode())
    first_name = data["name"]
    colour = data["colour"]
    try:
        mongo.db.people.insert_one({"name": first_name,
                                    "colour": colour})
    except PyMongo.errors.InvalidOperation:
        print("Errors... :-(")
        errors.append("Couldn't get text")

    return dumps({
        'first_name': first_name,
        'colour': colour
    })


@app.route('/login', methods=['POST'])
def process_login():
    email = request.form.get("email")
    password = request.form.get("password")
    token = ""
    user = mongo.db.users.find_one({"email": email, "password": password})
    # TODO: set the token properly with jwt
    if user is not None:
        token = email

    return {
        "email": email,
        "token": token
    }


@app.route('/passwordreset/request', methods=['POST'])
def auth_password_reset_request():
    """
    Given an email address, if the user is a registered user, semd an email
    with a link that they can access temporarily to change their password
    """
    email = request.values.get("email")

    msg = password_reset.password_reset_request(email)
    mail = Mail(app)
    mail.send(msg)

    return dumps({})


@app.route('/passwordreset/reset', methods=['POST'])
def auth_passwordreset_reset():
    """ Given a reset code, change user's password """

    email = request.form.get("email")
    reset_code = request.form.get("reset_code")
    new_password = request.form.get("new_password")
    hashedPassword = bcrypt.generate_password_hash(new_password)

    return dumps(
        password_reset.password_reset_reset(email, reset_code,
                                            hashedPassword, mongo)
    )


@app.route('/login', methods=['GET', 'POST'])
def login():
    print('In login')
    return dumps({})


@app.route('/accountregistration', methods=['POST'])
def account_registration():
    # ======= Backend validation =======
    # As front end checks could be bypassed
    email = request.form.get("email")
    val_reg.valid_email(mongo, email)

    firstName = request.form.get("firstName")
    val_reg.valid_name(firstName)

    lastName = request.form.get("lastName")
    val_reg.valid_name(lastName)

    password = request.form.get("password")
    val_reg.valid_pass(password)

    location = request.form.get("location")
    val_reg.valid_location(location)

    # Register a new account
    # Get all form values
    nickname = request.form.get("nickname")
    privFName = request.form.get("privFName")
    privLastName = request.form.get("privLastName")
    privEmail = request.form.get("privEmail")
    aboutMe = request.form.get("aboutMe")
    DOB = request.form.get('DOB')

    # Make some hashbrowns
    hashedPassword = bcrypt.generate_password_hash(password)

    print(firstName, lastName, email, nickname, password,
          privFName, privLastName, privEmail)

    # Insert account details into collection called 'user'
    mongo.db.users.insert({'fname': firstName,
                           'lname': lastName,
                           'email': email,
                           'nickname': nickname,
                           'password': hashedPassword,
                           'privFName': privFName,
                           'privLName':  privLastName,
                           'privEmail': privEmail,
                           'aboutMe': aboutMe,
                           'DOB': DOB,
                           'location': location
                           }
                          )
    return redirect(url_for('login'))


# Returns the two showdown images for the day
@app.route('/showdown/getImages', methods=['GET'])
def get_showdown_images():
    images = get_images()
    return dumps({
        'path_one': images[0],
        'path_two': images[1]
    })


# Returns the two showdown images for the day
@app.route('/welcome/getPopularContributors', methods=['GET'])
def welcome_get_contributors():
    images = get_popular_contributors_images()
    return dumps({
        # Returning a tuple
        'contributors': images
    })


@app.route('/welcome/getPopularImages', methods=['GET'])
def welcome_get_popular_images():
    images = get_popular_images()
    return dumps({
        'popular_images': images
    })


if __name__ == '__main__':
    app.run(debug=True)
