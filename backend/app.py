"""
Backend main file
"""

import os
import traceback
from json import dumps, loads

from flask import Flask, request
from flask_cors import CORS
from flask_mail import Mail
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from bson.objectid import ObjectId
from Error import EmailError, PasswordError
from showdown.get_images import get_images
from welcome.contributors import get_popular_contributors_images
from welcome.popular_images import get_popular_images
from profile_details import get_user_details
from token_decorator import validate_token

import password_reset
import validate_registration as val_reg
import token_functions

app = Flask(__name__, static_url_path='/static')
CORS(app)


def defaultHandler(err):
    """
    Description
    -----------
    Error Handler to pass messages to frontend

    Parameters
    ----------
    TODO

    Returns
    -------
    TODO
    """
    print(err)
    response = err.get_response()
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.description,
        "show_toast": err.toast
    })
    response.content_type = 'application/json'
    return response


app.register_error_handler(Exception, defaultHandler)

# Mongo setup, connect to the db
local_db = "mongodb://localhost:27017/angular-flask-muckaround"
remote_db = "mongodb://jajac:databasepassword@coen-townson.me:27017/angular-flask-muckaround?authSource=admin"
app.config["MONGO_URI"] = remote_db
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
def basic():
    """
    Test route
    """
    return dumps({
        'first_name': "test",
        'colour': "test"
    })


# Should this be using a GET request?
@app.route('/verifytoken', methods=['GET'])
def verify_token():
    """
    Verify that the token matches the secret
    Parameters
    ---------
    token : str
        The token of the current user

    Returns
    -------
    {valid : bool}
        Whether the token is valid or not
    """
    token = request.args.get('token')
    if token == '' or token is None:
        return {"valid": False}
    token_functions.verify_token(token)
    return {
        "valid": True
    }


@app.route('/login', methods=['POST'])
def process_login():
    """
    Logs into the system
    Parameters
    ----------
    email: str
    password : str

    Returns
    -------
    {token : str,
     u_id : str}

    """
    email = request.form.get("email")
    password = request.form.get("password")
    if email == "":
        raise EmailError("Please enter an email address.")
    if password == "":
        raise PasswordError("Please enter a password.")

    user = mongo.db.users.find_one({"email": email})
    if not user:
        raise EmailError("That email isn't registered.")
    hashedPassword = user["password"]

    u_id = ""
    token = ""
    if bcrypt.check_password_hash(hashedPassword, password):
        u_id = user["_id"]
        token = token_functions.create_token(str(u_id))
    else:
        raise PasswordError("That password is incorrect.")

    return {
        "u_id": str(u_id),
        "token": token
    }


@app.route('/passwordreset/request', methods=['POST'])
def auth_password_reset_request():
    """
    Given an email address, if the user is a registered user, send an email
    with a link that they can access temporarily to change their password

    Parameters
    ----------
    email : str

    Returns
    -------
    {}
    """
    email = request.form.get("email")

    msg = password_reset.password_reset_request(email)
    mail = Mail(app)
    mail.send(msg)

    return dumps({})


@app.route('/passwordreset/reset', methods=['POST'])
def auth_passwordreset_reset():
    """
    Given a reset code, change user's password

    Parameters
    ----------
    email : str
    reset_code : str
    new_password : str

    Returns
    -------
    {}
    """

    email = request.form.get("email")
    reset_code = request.form.get("reset_code")
    new_password = request.form.get("new_password")
    hashedPassword = bcrypt.generate_password_hash(new_password)

    return dumps(
        password_reset.password_reset_reset(email, reset_code,
                                            hashedPassword, mongo)
    )


@app.route('/accountregistration', methods=['POST'])
def account_registration():
    """
    Description
    -----------

    Parameters
    ----------

    Returns
    -------
    """
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
    return dumps({})


@app.route('/profiledetails', methods=['GET'])
def profile_details():
    """
    Description
    -----------
    Get all details of a user's details for their profile page

    Parameters
    ----------
    token : str

    Returns
    {
        fname,
        lname,
        nickname,
        location,
        email
    }
    -------
    """
    details = get_user_details(request.args.get("u_id"), mongo)

    return dumps({
        "fname": details["fname"],
        "lname": details["lname"],
        "nickname": details["nickname"],
        "location": details["location"],
        "email": details["email"]
    })


# Returns the two showdown images for the day
@app.route('/showdown/getImages', methods=['GET'])
def get_showdown_images():
    """
    Description
    -----------
    Get the two showdown images for the current showdown

    Parameters
    ----------
    N/A

    Returns
    -------
    {path_one, path_two}
    """
    images = get_images()
    return dumps({
        'path_one': images[0],
        'path_two': images[1]
    })


# Returns the two showdown images for the day
@app.route('/welcome/popularcontributors', methods=['GET'])
def welcome_get_contributors():
    """
    Description
    -----------
    Get some popular contributor profile images

    Parameters
    ----------
    N/A

    Returns
    -------
    {contributors: tup}
        tuple of contributors paths
    """
    images = get_popular_contributors_images()
    return dumps({
        # Returning a tuple
        'contributors': images
    })


@app.route('/welcome/getPopularImages', methods=['GET'])
def welcome_get_popular_images():
    """
    Description
    -----------
    Get paths of popular images

    Parameters
    ----------
    N/A

    Returns
    -------
    {popular_images: tup}
        tuple of image paths
    """
    images = get_popular_images()
    return dumps({
        'popular_images': images
    })


@app.route('/userdetails', methods=['GET'])
def user_info_with_token():
    """
    Description
    -----------
    GET request to get user details using a token

    Parameters
    ----------
    token : string

    Returns
    -------
    {fname:str, lname:str, nickname:str,
     email:str, DOB:str, location:str, aboutMe:str}

    """
    token = request.args.get('token')
    if token == '':
        return {}
    u_id = token_functions.verify_token(token)
    user = get_user_details(u_id['u_id'], mongo)
    # JSON Doesn't like ObjectId format
    return dumps({
        'fname': user['fname'],
        'lname': user['lname'],
        'email': user['email'],
        'nickname': user['nickname'],
        'DOB': user['DOB'],
        'location': user['location'],
        'aboutMe': user['aboutMe']
    })


@app.route('/manage_account/success', methods=['GET', 'POST'])
def manage_account():
    """
    Description
    -----------

    Parameters
    ----------

    Returns
    -------
    """
    errors = []
    data = loads(request.data.decode())
    print(type(data))
    # Need Something to Check if current logged in account exist in database
    # I am assuming user_id is stored in localStorage
    # Hard coded this part, this part should check what the logged in
    # user object_id is
    current_user = data['u_id']
    try:
        find_userdb = {"_id": ObjectId(current_user)}
        for key, value in data.items():
            if (value == "" or key == "u_id"):
                continue
            if (key == "password"):
                hashedPassword = bcrypt.generate_password_hash(value)
                mongo.db.users.update_one(find_userdb, {"$set": {key: hashedPassword}})
                
            else:                
                change_userdb = {"$set": {key: value}}
                mongo.db.users.update_one(find_userdb, change_userdb)

    # TODO: Catching too general using Exception. Replace with e.g. ValueError
    except Exception:
        print("Errors... :-(")
        print(traceback.format_exc())
        errors.append("Couldn't get text")

    return dumps(data)


@app.route('/manage_account/confirm', methods=['GET', 'POST'])
def password_check():
    """
    Description
    -----------

    Parameters
    ----------

    Returns
    -------
    """
    # data = json.loads(request.data.decode())
    # Need Something to Check if current logged in account exist in database
    # I am assuming user_id is stored in localStorage
    # Hard coded this part, this part should check what
    # the logged in user object_id is

    data = request.form.to_dict()
    current_user = data['u_id']
    user_object = mongo.db.users.find_one({"_id": ObjectId(current_user)})
    current_password = user_object['password']

    # TODO: set the token properly with jwt
    if bcrypt.check_password_hash(current_password, data['password']):
        data['password'] = "true"
    else:
        data['password'] = "false"
    print(data)

    return data


@app.route('/get_user_info', methods=['GET', 'POST'])
def get_user():
    """
    Description
    -----------

    Parameters
    ----------

    Returns
    -------
    """
    data = request.form.to_dict()
    current_uid = data['u_id']
    current_user = mongo.db.users.find_one({"_id": ObjectId(current_uid)})
    data['fname'] = current_user['fname']
    data['lname'] = current_user['lname']
    data['email'] = current_user['email']
    data['nickname'] = current_user['nickname']
    data['dob'] = current_user['DOB']
    data['location'] = current_user['location']
    data['aboutMe'] = current_user['aboutMe']

    return data


@app.route('/user/profile/uploadphoto', methods=['POST'])
def upload_photo():
    """
    Description
    -----------

    Parameters
    ----------

    Returns
    -------
    """


'''
---------------
- Test Routes -
---------------
'''


@app.route('/testdecorator', methods=['GET'])
@validate_token
def test_decorator():
    '''
    Testing decorator for validating token
    Use this decorator to verify the token is
    valid and matches the secret
    '''
    print("YAY")
    return dumps({
        "success": "success"
    })


if __name__ == '__main__':
    app.run(port=8001, debug=True)
