"""
Backend main file
Handle requests to and from server and web app client
 - Team JAJAC :)
"""

# Pip functions
import traceback
import mongoengine
from json import dumps, loads
from bson.objectid import ObjectId
from flask import Flask, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail
from flask_pymongo import PyMongo

# JAJAC made functions

# Comments
from lib.comments.comment_photo import comments_photo
from lib.photo.fs_interactions import find_photo

# Photo
from lib.photo.photo_edit import create_photo_entry, update_photo_details, get_photo_edit
from lib.photo.remove_photo import remove_photo

# Photo details
from lib.photo_details.photo_details import get_photo_details
from lib.photo_details.photo_likes import is_photo_liked, update_likes_mongo

# Profile
from lib.profile.profile_details import get_user_details
from lib.profile.upload_photo import update_user_thumbnail

# Search
from lib.search.user_search import user_search
from lib.search.photo_search import photo_search

# Showdown
from lib.showdown import get_images

# User
from lib.user.validate_login import login
import lib.user.password_reset as password_reset
from lib.user.user import User

# Welcome
from lib.welcome.contributors import get_popular_contributors_images
from lib.welcome.popular_images import get_popular_images

# Other/utils
from lib.token_decorator import validate_token
import lib.token_functions as token_functions
from lib import db
from lib import Error
import lib



# Config
from config import DevelopmentConfig, defaultHandler


app = Flask(__name__, static_url_path='/static')
app.config.from_object(DevelopmentConfig)
app.register_error_handler(Exception, defaultHandler)
CORS(app)
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
mongoengine.connect('angular-flask-muckaround')


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

    ret = login(bcrypt, email, password)

    return dumps(ret)


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
    'profilePic': base64,
    'extension': str,
    'aboutMe': str,
    'DOB': str,
    'location': str

    Returns
    -------
    None
    """
    new_user = request.form.to_dict()

    # Make some hashbrowns
    hashed_password = bcrypt.generate_password_hash(new_user["password"])
    new_user["password"] = hashed_password

    # Handle profile pic
    if new_user.get('profilePic') == "":
        new_user['profilePic'] = ["", ""]
    else:
        new_user['profilePic'] = update_user_thumbnail(new_user['profilePic'],
                                                       new_user['extension'])

    this_user = User(
        fname=new_user['fname'],
        lname=new_user['lname'],
        email=new_user['email'],
        nickname=new_user['nickname'],
        password=new_user['password'],
        profile_pic=new_user['profilePic'],
        extension=new_user['extension'],
        about_me=new_user['aboutMe'],
        location=new_user['location']
    )
    this_user.save()


    # Insert account details into collection called 'user'
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
        email,
        profilePic
    }
    -------
    """
    user = User.objects.get(id=request.args.get("u_id"))
    if not user:
        raise Error.UserDNE("Couldn't find user")

    return dumps({
        "fname": user.get_fname(),
        "lname": user.get_lname(),
        "nickname": user.get_nickname(),
        "location": user.get_location(),
        "email": user.get_email(),
        "profilePic": user.get_profile_pic()
    })


@app.route('/purchases/buycredits', methods=['POST'])
@validate_token
def buy_credits():
    """
    Description
    -----------
    User buys credits.

    Parameters
    ----------
    token: str,
    ncredits: int

    Returns
    -------
    {'credits_bought': int}
    """
    token = request.form.get("token")
    user_id = token_functions.get_uid(token)
    credits_to_add = int(request.form.get("ncredits"))

    user = User.objects.get(id=user_id)

    user.add_credits(credits_to_add)
    user.save()

    return dumps({
        'credits_bought': credits_to_add
    })

@app.route('/purchases/refundcredits', methods=['POST'])
@validate_token
def refund_credits():
    """
    Description
    -----------
    User refunds credits.

    Parameters
    ----------
    token: str,
    ncredits: int

    Returns
    -------
    {'credits_refunded': int}
    """
    token = request.form.get("token")
    user_id = token_functions.get_uid(token)
    credits_to_refund = int(request.form.get("ncredits"))

    user = User.objects.get(id=user_id)
    user.remove_credits(credits_to_refund)
    try:
        user.save()
    except mongoengine.ValidationError:
        raise Error.ValidationError("User has insufficient credits")

    return dumps({
        'credits_refunded': credits_to_refund
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
    u_id = token_functions.get_uid(token)
    user = User.objects.get(id=u_id)
    if not user:
        raise Error.UserDNE("Could not find user")
    # JSON Doesn't like ObjectId format
    return dumps({
        'fname': user.get_fname(),
        'lname': user.get_lname(),
        'email': user.get_email(),
        'nickname': user.get_nickname(),
        'credits': user.get_credits(),
        'location': user.get_location(),
        'aboutMe': user.get_about_me(),
        'profilePic': user.get_profile_pic()
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
    success = False
    data = loads(request.data.decode())
    user = User.objects.get(id = data['u_id'])
    if user is None:
        raise Error.UserDNE("User with id " + data['u_id'] + "does not exist")
    try:
        for key, value in data.items():
            lib.user.helper_functions.update_value(bcrypt, user, key, value)
        success = True
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
    user_object = User.objects.get(id=current_user)
    if user_object is None:
        raise Error.UserDNE("User " + current_user + "does not exist")

    # TODO: set the token properly with jwt
    if bcrypt.check_password_hash(user_object.get_password(), data['password']):
        data['password'] = "true"
    else:
        data['password'] = "false"
    print(data)

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
    token: str,
    tags: str[],
    albums: str[],
    photo: str,
    extension: str
    Returns
    -------
    None
    """
    photo_details = request.form.to_dict()
    return dumps(create_photo_entry(photo_details))

@app.route('/user/updatephoto', methods=['GET'])
@validate_token
def photo_details_edit():
    """
    TODO: Update to mongoengine
    Description
    -----------
    Validates that the user is allowed to edit the photo

    Parameters
    ----------
    photoId: str
    token: str

    Returns
    -------
    success or error
    """

    photoId = request.args.get('photoId')
    token = request.args.get('token')

    return dumps(get_photo_edit(mongo, photoId, token))

@app.route('/user/updatephoto', methods=['PUT'])
@validate_token
def update_photo():
    """
    TODO: Update to mongoengine
    Description
    -----------
    Accepts parameters related to EDITING photo details, verifies the parameters,
    creates a database entry for the photo and saves the photo details
    to backend.

    Parameters
    ----------
    title: str,
    price: str,
    tags: str[],
    albums: str[],
    discount: str,
    token: str,
    photo: str

    Returns
    -------
    success or error
    """
    photo_details = request.form.to_dict()
    # Update either price, title, keywords or add discount
    return dumps(update_photo_details(mongo, photo_details))

@app.route('/user/updatephoto/deleted', methods=['GET'])
@validate_token
def check_deleted():
    """
    TODO: Update to mongoengine
    Description
    -----------
    Check if the photo is marked as deleted

    Parameters
    ----------
    photoId: str

     Returns
    -------
    {deleted: boolean(string)}
    """
    photoId = request.args.get("photoId")
    res = mongo.db.photos.find_one({"_id": ObjectId(photoId)}, {"deleted": 1})

    return dumps({"deleted": res["deleted"]})

@app.route('/user/updatephoto', methods=['DELETE'])
@validate_token
def user_remove_photo():
    '''
    TODO: Update to mongoengine
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
    TODO: Update to mongoengine
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
    TODO: Update to mongoengine
    Description
    -----------
    GET request to return many user details based on a query

    Parameters
    ----------
    query : string
    offset : int
    limit : int
    orderby : string

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

@app.route('/search/photo', methods=['GET'])
def search_photo():
    """
    TODO: Update to mongoengine
    Description
    -----------
    GET request to return many photo details based on a query

    Parameters
    ----------
    query : string
    offset : int
    limit : int
    orderby : string
    filetype : string
    priceMin : int
    priceMax : int

    Returns
    -------
    {
        title : string
        price : int
        discount : int
        photoStr : string
        metadata : string
        id : string
    }
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(photo_search(data, mongo))

@app.route('/search/collection', methods=['GET'])
def search_collection():
    """
    TODO: Update to mongoengine
    Description
    -----------
    GET request to return many user details based on a query

    Parameters
    ----------
    query : string
    offset : int
    limit : int
    orderby : string

    Returns
    -------
    {
        TODO
    }
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps({[]})

@app.route('/search/album', methods=['GET'])
def search_album():
    """
    TODO: Update to mongoengine
    Description
    -----------
    GET request to return many album details based on a query

    Parameters
    ----------
    query : string
    offset : int
    limit : int
    orderby : string

    Returns
    -------
    {
        TODO
    }
    """
    return dumps({[]})


'''
-------------------
- End Search Routes -
-------------------
'''



@app.route('/photo_details', methods=['GET'])
def photo_details():
    # TODO: Should return photos and comments as well
    # Add to API list
    """
    TODO: Update to mongoengine
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
    #print("PRINTING CURRENT USER")
    #print(current_user)

    if current_user != "" and current_user != "null":
        current_user_details = get_user_details(current_user, mongo)
        #purchased = (photo_details['_id'] in current_user_details['purchased'])
        purchased = (photo_details['_id'] in current_user_details['purchased'])
    else :
        purchased = False
    #TODO: Find out how to send dates over
    #"posted": photo_details["posted"],

    img = find_photo(f"{photo_id}{photo_details['extension']}")

    return dumps({
        "u_id": p_id_string,
        "title": photo_details['title'],
        "likes": photo_details["likes"],
        "tagsList": photo_details["tags"],
        "nickname": artist['nickname'],
        "email": artist['email'],
        "purchased": purchased,
        "photoStr" : img,
        "metadata" : photo_details['metadata'],
        "price" : photo_details["price"],
        "discount" : photo_details["discount"],
        "deleted" : photo_details["deleted"],

    })


@app.route('/photo_details/isLiked', methods=['GET'])
def photo_liked():
    """
    TODO: Update to mongoengine
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
    TODO: Update to mongoengine
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
    token = params.get("token")
    #print("NEW COUNT: " + params.get("count"))
    try:
        token_functions.verify_token(token)
        update_likes_mongo(photo_id, user_id, new_count, upvote, mongo)
        return dumps({
            "valid": True
        })
    except Exception:
        return dumps({
            "valid": False
        })

    update_likes_mongo(photo_id, user_id, new_count, upvote, mongo)
    return dumps({})


@app.route('/comments/comment', methods=['POST'])
def comment_photo():
    """
    TODO: Update to mongoengine
    Description
    -----------
    Adds Comments to Mongo

    Parameters
    ----------
    photoId : string
    userId : string (Commenter)
    posted : date
    content : string

    Returns
    -------
    None
    """
    params = request.form.to_dict()
    photo_id = params.get("photoId")
    user_id = params.get("currentUser")
    posted = params.get("commentDate")
    content = params.get("commentContent")

    comments_photo(photo_id, user_id, posted, content, mongo)
    return dumps({})

@app.route('/get_current_user', methods=['GET'])
def get_verified_user():
    """
    TODO: Update to mongoengine
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

if __name__ == '__main__':
    app.run(port=8001, debug=True)
