"""
Backend main file
Handle requests to and fro server and web app client
 - Team JAJAC :)
"""
# Pip functions
import traceback
from json import dumps, loads
from bson.objectid import ObjectId
from flask import Flask, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail
from flask_pymongo import PyMongo
import base64
import datetime


# JAJAC made functions
from lib.showdown import get_images
from lib.welcome.contributors import get_popular_contributors_images
from lib.welcome.popular_images import get_popular_images
from lib.profile.profile_details import get_user_details
from lib.profile.upload_photo import update_user_thumbnail
from lib.search.user_search import user_search
from lib.token_decorator import validate_token
from lib.validate_login import login
from lib.validate_photo_details import validate_photo, reformat_lists
import lib.password_reset as password_reset
import lib.validate_registration as val_reg
import lib.token_functions as token_functions
from lib import db
from lib.photo_details.photo_details import get_photo_details
from lib.photo_details.photo_likes import is_photo_liked
from lib.photo.remove_photo import remove_photo
from lib.photo_details.photo_likes import update_likes_mongo
import lib.photo_details.photo_details as photo_details_lib 

# Config
from config import DevelopmentConfig, defaultHandler


app = Flask(__name__, static_url_path='/static')
app.config.from_object(DevelopmentConfig)
app.register_error_handler(Exception, defaultHandler)
CORS(app)
mongo = PyMongo(app)
bcrypt = Bcrypt(app)


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
    if request.method == 'GET':
        token = request.args.get('token')
    else:
        token = request.form.get('token')

    if token == '' or token is None:
        return dumps({"valid": False})

    try:
        token_functions.verify_token(token)
        return dumps({
            "valid": True
        })
    except Exception:
        return dumps({
            "valid": False
        })


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
    {
        token : str,
        u_id : str,
        nickname : str
    }

    """
    email = request.form.get("email")
    password = request.form.get("password")

    return dumps(login(mongo, bcrypt, email, password))


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
    hashed_password = bcrypt.generate_password_hash(new_password)

    return dumps(
        password_reset.password_reset_reset(email, reset_code,
                                            hashed_password, mongo)
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
params = request.form.to_dict()
    photo_id = params.get("photoId")
    user_id = params.get("userId")
    new_count = int(params.get("count"))
    upvote = params.get("upStatus")
    print("NEW COUNT: " + params.get("count"))
    update_likes_mongo(photo_id, user_id, new_count, upvote, mongo)
    Returns
    -------
    None
    """
    new_user = request.form.to_dict()
    val_reg.valid_registration(mongo, new_user)

    # Make some hashbrowns
    hashed_password = bcrypt.generate_password_hash(new_user["password"])
    new_user["password"] = hashed_password

    # Handle profile pic
    if new_user.get('profilePic') is None:
        new_user['profilePic'] = ""
    else:
        new_user['profilePic'] = update_user_thumbnail(new_user['profilePic'])

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
    u_id : str

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
        "fname": details['fname'],
        "lname": details['lname'],
        "nickname": details["nickname"],
        "location": details["location"],
        "email": details["email"],
        "profilePic": details["profilePic"]
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
    images = get_images.get_showdown_competing_photos()
    return dumps({
        'path_one': images[0],
        'path_two': images[1]
    })


@app.route('/showdown/getwinner', methods=['GET'])
def showdown_getwinner():
    """
    Description
    -----------
    Get the winning photo from the last showdown

    Parameters
    ----------
    N/A

    Returns
    -------
    CURRENTLY returns a static path
    """
    path = get_images.get_showdown_winner_image()
    return dumps({'path': path})



@app.route('/welcome/popularcontributors', methods=['GET'])
def welcome_get_contributors():
    """
    Description
    -----------
    Get some contributor profile pictures

    Parameters
    ----------
    N/A

    Returns
    -------
    A list of images
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
        print("token is an empty string")
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
        'aboutMe': user['aboutMe'],
        'profilePic': user['profilePic']
    })


# TODO Move this to a separate file?
@app.route('/manageaccount/success', methods=['POST'])
def manage_account():
    """
    Description
    -----------
    Takes a user object and updates key:value pairs in the database

    Parameters
    ----------
    user:object

    e.g.
    user {
        u_id: string,
        password: string,
        profilePic: string,
        ...:...,
    }

    Returns
    -------
    {'success: boolean}
    """
    '''
    Need Something to Check if current logged in account exist in database
    I am assuming user_id is stored in localStorage
    Hard coded this part, this part should check what the logged in
    user object_id is
    '''
    success = False
    try:
        data = loads(request.data.decode())
        current_user = data['u_id']
        find_userdb = {"_id": ObjectId(current_user)}
        for key, value in data.items():
            if (value == "" or key == "u_id"):
                continue
            if key == "password":
                hashed_password= bcrypt.generate_password_hash(value)
                mongo.db.users.update_one(find_userdb, {"$set": {
                                                            key:
                                                            hashed_password}})
            elif key == "profilePic":
                img_and_filetype = update_user_thumbnail(value)
                mongo.db.users.update_one(find_userdb, {"$set": {
                                                            key:
                                                            img_and_filetype}})
            else:
                change_userdb = {"$set": {key: value}}
                mongo.db.users.update_one(find_userdb, change_userdb)

        success = True

    # TODO: Catching too general using Exception. Replace with e.g. ValueError
    except Exception:
        print("Errors... :-(")
        print(traceback.format_exc())
        success = False


    return dumps({'success': success})



@app.route('/manageaccount/confirm', methods=['GET', 'POST'])
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


@app.route('/user/uploadphoto', methods=['POST'])
@validate_token
def upload_actual_photo():
    """
    Description
    -----------
    Accepts parameters related to a photo, verifies the parameters,
    creates a database entry for the photo and saves the photo file
    to backend/images.

    Parameters
    ----------
    title: str,
    price: str,
    tags: [],
    albums: [],
    photo: str,
    Returns
    -------
    None
    """
    photo_details = request.form.to_dict()
    photo_details = reformat_lists(photo_details)
    validate_photo(photo_details)

    # Get these values before popping them
    base64_str = photo_details['photo']
    extension = photo_details['extension']

    user_uid = token_functions.get_uid(photo_details['token'])
    default = {
        "discount": 0.0,
        "posted": datetime.datetime.now(),
        "user": ObjectId(user_uid),
        "likes": 0,
        "comments": ["TODO"],
        "won": "TODO",
        "deleted": False,
    }
    photo_details.update(default)
    photo_details.pop("photo")
    photo_details.pop("extension")
    photo_details.pop("token")
    # Insert photo entry, except "path" attribute
    photo_entry = mongo.db.photos.insert_one(photo_details)

    photo_oid = photo_entry.inserted_id
    name = str(photo_oid)

    # Set image path to ./backend/images/'xxxxxx.extension'
    folder = './backend/images/'
    file_name = name + extension
    path = folder + file_name
    # Remove metadata from b64
    img_data = base64.b64decode(base64_str.split(',')[1])

    # Save image to /backend/images directory
    with open(path, 'wb') as f:
        f.write(img_data)

    print("An image was written to " + path)

    # Add "path" attribute to db entry
    query = {"_id": ObjectId(name)}
    set_path = {"$set": {"pathToImg": path}}
    mongo.db.photos.update_one(query, set_path)

    return dumps({
        "success": "success"
    })


@app.route('/user/photos/removephoto', methods=['DELETE'])
@validate_token
def user_remove_photo():
    '''
    Description
    -----------
    Remove a photo that a user has uploaded

    Parameters
    ----------
    token: str
    imgId: str
        Image's ObjectId

    Returns
    -------
    {success: boolean(string)}
    '''
    token = request.args.get('token')
    u_id = token_functions.get_uid(token)
    img_id = request.args.get('imgId')
    # Temporary identifier
    identifier = {
        '_id': ObjectId(img_id)
    }
    res = remove_photo(mongo.db.photos, u_id, identifier)
    if res is True:
        return dumps({'success': 'true'})
    else:
        return dumps({'success': 'false'})


@app.route('/user/profile/uploadphoto', methods=['POST'])
@validate_token
def upload_photo():
    """
    Description
    -----------
    Parameters
    ----------
    img_path : string
        e.g. http://imagesite.com/img.png
    token : string
    Returns
    -------
    {}
    """
    '''
    TODO
    '''
    token = request.form.get('token')
    img_path = request.form.get('img_path')
    thumbnail_and_filetype = update_user_thumbnail(img_path)
    u_id = token_functions.get_uid(token)
    db.update_user(mongo, u_id, 'profilePic', thumbnail_and_filetype)
    # Update the database...
    return dumps({
        'success': 'True'
    })


'''
---------------
- Search Routes -
---------------
'''


@app.route('/search/user', methods=['GET'])
def search_user():
    """
    Description
    -----------
    GET request to return many user details based on a query

    Parameters
    ----------
    query : string
    offset : int
    limit : int

    Returns
    -------
    {
        fname: str,
        lname: str,
        nickname: str,
        email: str,
        location: str,
    }
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(user_search(data, mongo))


@app.route('/photo_details', methods=['GET'])
def photo_details():
    # TODO: Should return photos and comments as well
    # Add to API list
    """
    Description
    -----------
    GET request to retrieve information for a photo

    Parameters
    ----------
    p_id : string
    u_id : string (Id of current user)

    Returns
    -------
    {
        title: str,
        numLikes: number,
        datePosted: Date,
        tags: str[],
        nickname: str (Artist's Nickname)
        email: str
        u_id: str, (Artist of the photo)
    }
    """
    photo_id = request.args.get("p_id")
    current_user = request.args.get("u_id")
    
    #This is if posts are stored in user entity
    #artist = mongo.db.users.find_one({"posts": [ObjectId(photo_id)]})
    #p_id_string = str(artist['_id'])
    
    photo_details = get_photo_details(photo_id, mongo)
    
    p_id_string = str(photo_details['user'])
    artist = mongo.db.users.find_one({"_id": photo_details['user']})
    print("PRINTING CURRENT USER")
    print(current_user)
    
    if current_user != "" and current_user != "null":
        current_user_details = get_user_details(current_user, mongo)
        purchased = (photo_details['_id'] in current_user_details['purchased'])
    else :
        purchased = False
    #TODO: Find out how to send dates over
    #"posted": photo_details["posted"],

    return dumps({
        "u_id": p_id_string,
        "title": photo_details['title'],
        "likes": photo_details["likes"],
        "tagsList": photo_details["tags"],
        "nickname": artist['nickname'],
        "email": artist['email'],
        "pathToImg": photo_details['pathToImg'],
        "purchased": purchased,
        
    })
    
    
@app.route('/photo_details/isLiked', methods=['GET'])
def photo_liked():
    """
    Description
    -----------
    GET request to retrieve information for a photo

    Parameters
    ----------
    p_id : string
    u_id : string

    Returns
    -------
    {
        isLiked : boolean
    }
    """
    photo_id = request.args.get("p_id")
    user_id = request.args.get("u_id")
    isLiked = is_photo_liked(photo_id, user_id, mongo)
    return dumps({
        "isLiked": isLiked,
    })
 
@app.route('/photo_details/updateLikes', methods=['POST'])
def update_likes():
    """
    Description
    -----------
    Form request that updates the likes of a photo on mongo

    Parameters
    ----------
    photoId : string
    userId : string
    count : number (Number of Likes)
    upStatus : boolean (True if liking, false if unliking)

    Returns
    -------
    None
    """
    params = request.form.to_dict()
    photo_id = params.get("photoId")
    user_id = params.get("userId")
    new_count = int(params.get("count"))
    upvote = params.get("upStatus")
    #print("NEW COUNT: " + params.get("count"))
    update_likes_mongo(photo_id, user_id, new_count, upvote, mongo)
    return dumps({})

@app.route('/get_current_user', methods=['GET'])
def get_verified_user():
    """
    Description
    -----------
    Gets user id from token

    Parameters
    ----------
    token : string

    Returns
    -------
    {
        u_id : string
    }
    """
    token = request.args.get("token")
    if token == None:
        return dumps({
            "u_id": "",
        })
    u_id = token_functions.get_uid(token)
    return dumps({
        "u_id": u_id, 
    })

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


@app.route('/', methods=['GET'])
def basic():
    """
    Basic Test route
    """
    arguments = {
            'first_name': 'test',
            'colour': 'test'
            }
    if request.args:
        arguments = request.args
    print(arguments)
    return dumps(arguments)

