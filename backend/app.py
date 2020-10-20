"""
Backend main file
Handle requests to and fro server and web app client
 - Team JAJAC :)
"""
from flask import Flask, request
from flask_cors import CORS
from flask_mail import Mail
from flask_pymongo import PyMongo
from config import DevelopmentConfig, defaultHandler
import traceback
from json import dumps, loads
import base64
from flask_bcrypt import Bcrypt
from bson.objectid import ObjectId

from lib.showdown.get_images import get_images
from lib.welcome.contributors import get_popular_contributors_images
from lib.welcome.popular_images import get_popular_images
from lib.profile_details import get_user_details
from lib.token_decorator import validate_token
from lib.validate_login import login
from lib.validate_photo_details import validate_photo, reformat_lists
import lib.password_reset as password_reset
import lib.validate_registration as val_reg
import lib.token_functions as token_functions
import datetime

app = Flask(__name__, static_url_path='/static')
app.config.from_object(DevelopmentConfig)
app.register_error_handler(Exception, defaultHandler)
CORS(app)
mongo = PyMongo(app)
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

@app.route('/verifytoken', methods=['GET','POST'])
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
    if request.method == 'GET':
        token = request.args.get('token')
    else:
        token = request.form.get('token')
    
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

    return login(mongo, bcrypt, email, password)


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
    Register new user

    Parameters
    ----------
    'fname': str,
    'lname': str,
    'email': str,
    'nickname': str,
    'password': str,
    'privFName': str,
    'privLName':  str,
    'privEmail': str,
    'aboutMe': str,
    'DOB': str,
    'location': str

    Returns
    -------
    None
    """
    new_user = request.form.to_dict()
    val_reg.valid_registration(mongo, new_user)

    # Make some hashbrowns
    hashedPassword = bcrypt.generate_password_hash(new_user["password"])
    new_user["password"] = hashedPassword

    # Insert account details into collection called 'user'
    mongo.db.users.insert(new_user)
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
        fname + lname,
        nickname,
        location,
        email
    }
    -------
    """
    details = get_user_details(request.args.get("u_id"), mongo)

    return dumps({
        "name": f"{details['fname']} {details['lname']}",
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

# TODO Move this to a separate file?
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


@app.route('/user/profile/uploadphoto/details', methods=['POST'])
def upload_photo_details():
    """
    Description
    -----------

    Parameters
    ----------
    title: str,
    price: str,
    tagsList: [],
    albumsToAddTo: [],
    Returns
    -------
    None
    """
    photo_details = request.form.to_dict()
    # print(photo_details)
    base64Str = photo_details['photo']
    # base64Str += "==="
    fileName = photo_details['title'] + photo_details['extension']
    imgData = base64.b64decode(base64Str.split(',')[1])
    # with open('log.txt', 'wb') as log:
    #     log.write(base64Str.encode())

    # This currently creates image files in /backend/images directory
    with open('./backend/images/' + fileName, 'wb') as f:
        f.write(imgData)

    print("written")
    photo_details = reformat_lists(photo_details)
    validate_photo(photo_details)

    default = {
        "discount": 0.0,
        "posted": datetime.datetime.now(),
        "user": "temp user",
        "likes": 0,
        "comments": ["insert comment objects", "comment1", "comment2"],
        "won": False
    }
    photo_details.update(default)
    # print(photo_details)
    mongo.db.photos.insert_one(photo_details)
    print(photo_details['title'])
    print(photo_details['extension'])
    return dumps({
        "success": "success"
    })

# TODO having trouble sending photo 
@app.route('/user/profile/uploadphoto', methods=['POST'])
def upload_photo():
    print(request.form)
    return dumps({})

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
