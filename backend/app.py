"""
Backend main file
Handle requests to and from server and web app client
 - Team JAJAC :)
"""

# Pip functions
import traceback
import mongoengine
from json import dumps, loads
from bson.objectid import ObjectId, InvalidId
from flask import Flask, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail
from flask_pymongo import PyMongo
from werkzeug.exceptions import HTTPException

# Classes
import lib.photo.photo
from lib.token_functions import get_uid
import lib.user.user
import lib.catalogue.catalogue as catalogue
import lib.album.album
import lib.comment.comment as comment

# JAJAC made functions

# Albums
from lib.album.album_edit import create_album, get_albums

# Comments
import lib.comment.comment_photo as comment_photo
from lib.comment.get_comments import get_all_comments
from datetime import datetime

# Photo
from lib.photo.photo_edit import create_photo_entry, update_photo_details
from lib.photo.photo_edit import get_photo_edit
from lib.photo.remove_photo import remove_photo

# Photo details
from lib.photo_details.photo_likes import is_photo_liked, like_photo


# Profile
from lib.profile.upload_photo import update_user_thumbnail
from lib.profile.profile_details import (
    user_album_search,
    user_collection_search,
    user_following_search,
    user_photo_search,
)

# Search
# from lib.search.user_search import user_search
# from lib.search.photo_search import photo_search
from lib.search.search import album_search, photo_search, user_search, collection_search

# Showdown
from lib.showdown import get_images

# User
from lib.user.validate_login import login
import lib.user.helper_functions
import lib.user.password_reset as password_reset

# Welcome
from lib.welcome.contributors import get_popular_contributors_images
from lib.welcome.popular_images import get_popular_images

# Other/utils
from lib.token_decorator import validate_token
import lib.token_functions as token_functions
from lib import Error
import lib

# Config
from config import DevelopmentConfig, defaultHandler


app = Flask(__name__, static_url_path="/static")
app.config.from_object(DevelopmentConfig)
app.register_error_handler(HTTPException, defaultHandler)
CORS(app)
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
mongoengine.connect("angular-flask-muckaround", host=app.config["MONGO_URI"])

"""
--------------------------
- Account Management Routes -
--------------------------
"""


@app.route("/verifytoken", methods=["GET"])
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
    if request.method == "GET":
        token = request.args.get("token")
    else:
        token = request.form.get("token")

    if token == "" or token is None:
        return dumps({"valid": False})

    try:
        token_functions.verify_token(token)
        return dumps({"valid": True})
    except Exception:
        return dumps({"valid": False})


@app.route("/login", methods=["POST"])
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


@app.route("/passwordreset/request", methods=["POST"])
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


@app.route("/passwordreset/reset", methods=["POST"])
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
        password_reset.password_reset_reset(email, reset_code, hashed_password, mongo)
    )


@app.route("/accountregistration", methods=["POST"])
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
    'profilePic': base64,
    'extension': str,
    'aboutMe': str,
    'location': str

    Returns
    -------
    None
    """
    new_user = request.form.to_dict()
    print(new_user)
    # Make some hashbrowns
    hashed_password = bcrypt.generate_password_hash(new_user["password"])
    new_user["password"] = hashed_password

    # Handle profile pic
    if new_user.get("profilePic") == "":
        new_user["profilePic"] = ["", ""]
    else:
        new_user["profilePic"] = update_user_thumbnail(
            new_user["profilePic"], new_user["extension"]
        )

    this_user = lib.user.user.User(
        fname=new_user["fname"],
        lname=new_user["lname"],
        email=new_user["email"],
        nickname=new_user["nickname"],
        password=new_user["password"],
        profile_pic=new_user["profilePic"],
        extension=new_user["extension"],
        location=new_user["location"],
        about_me=new_user["aboutMe"],
    )
    this_user.save()

    return dumps({})


@app.route("/userdetails", methods=["GET"])
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
    token = request.args.get("token")
    if token == "":
        print("token is an empty string")
        return {}
    u_id = token_functions.get_uid(token)
    this_user = lib.user.user.User.objects.get(id=u_id)
    if not this_user:
        raise Error.UserDNE("Could not find user")
    # JSON Doesn't like ObjectId format
    return dumps(
        {
            "fname": this_user.get_fname(),
            "lname": this_user.get_lname(),
            "email": this_user.get_email(),
            "nickname": this_user.get_nickname(),
            "credits": this_user.get_credits(),
            "location": this_user.get_location(),
            "aboutMe": this_user.get_about_me(),
            "profilePic": this_user.get_profile_pic(),
        }
    )


@app.route("/manageaccount/success", methods=["POST"])
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
    data = request.form.to_dict()
    u_id = token_functions.get_uid(data["token"])
    this_user = lib.user.user.User.objects.get(id=u_id)

    if data.get("profilePic") != "":
        data["profilePic"] = update_user_thumbnail(
            data["profilePic"], data["extension"]
        )

    if this_user is None:
        raise Error.UserDNE("User with id " + this_user + "does not exist")
    try:

        for key, value in data.items():
            lib.user.helper_functions.update_value(bcrypt, this_user, key, value)
        success = True
    except Exception:
        print("Errors... :-(")
        print(traceback.format_exc())
        success = False

    return dumps({"success": success})


@app.route("/manageaccount/confirm", methods=["GET", "POST"])
@validate_token
def password_check():
    """
    Description
    -----------
    Checks if the user has entered their password correctly
    to verify that they can change their details.

    Parameters
    ----------
    token: string
    password: string

    Returns
    -------
    password: boolean
    """
    data = request.form.to_dict()
    token = data["token"]
    user_id = token_functions.get_uid(token)
    user_object = lib.user.user.User.objects.get(id=user_id)

    if user_object is None:
        raise Error.UserDNE("User with token" + token + "does not exist")

    if bcrypt.check_password_hash(user_object.get_password(), data["password"]):
        data["password"] = "true"
    else:
        data["password"] = "false"
    print(data)

    return data


"""
--------------------
- Profile Routes -
--------------------
"""


@app.route("/profiledetails", methods=["GET"])
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
        profilePic,
        aboutMe
    }
    -------
    """
    this_user = lib.user.user.User.objects.get(id=request.args.get("u_id"))
    if not this_user:
        raise Error.UserDNE("Couldn't find user")

    return dumps(
        {
            "fname": this_user.get_fname(),
            "lname": this_user.get_lname(),
            "nickname": this_user.get_nickname(),
            "location": this_user.get_location(),
            "email": this_user.get_email(),
            "profilePic": this_user.get_profile_pic(),
        }
    )


@app.route("/user/photos", methods=["GET"])
def _get_photo_from_user():
    """
    Description
    -----------
    GET request to return photos created by a user

    Parameters
    ----------
    offset : int
    limit : int
    token : string
    query : string

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

    return dumps(user_photo_search(data))


@app.route("/user/collections", methods=["GET"])
def _get_collection_from_user():
    """
    Description
    -----------
    GET request to return collections created by a user

    Parameters
    ----------
    offset : int
    limit : int
    token : string
    query : string

    Returns
    -------
    {
        title : string
        authorId : string
        author : string
        created : string
        id : string
    }
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(user_collection_search(data))


@app.route("/user/albums", methods=["GET"])
def _get_album_from_user():
    """
    Description
    -----------
    GET request to return albums created by a user

    Parameters
    ----------
    offset : int
    limit : int
    token : string
    query : string

    Returns
    -------
    {
        title : string
        authorId : string
        author : string
        discount : int
        created : string
        id : string
    }
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(user_album_search(data))


@app.route("/user/following", methods=["GET"])
def _get_following_from_user():
    """
    Description
    -----------
    GET request to return users the current user is following

    Parameters
    ----------
    offset : int
    limit : int
    token : string
    query : string

    Returns
    -------
    {
        fname : string
        lname : string
        nickname : string
        email : string
        location : string
        created : string
        id : string
    }
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(user_following_search(data))


"""
--------------------
- Purchases Routes -
--------------------
"""


@app.route("/purchases/buycredits", methods=["POST"])
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

    this_user = lib.user.user.User.objects.get(id=user_id)

    this_user.add_credits(credits_to_add)
    this_user.save()

    return dumps({"credits_bought": credits_to_add})


@app.route("/purchases/refundcredits", methods=["POST"])
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

    this_user = lib.user.user.User.objects.get(id=user_id)
    this_user.remove_credits(credits_to_refund)
    try:
        this_user.save()
    except mongoengine.ValidationError:
        raise Error.ValidationError("User has insufficient credits")

    return dumps({"credits_refunded": credits_to_refund})


"""
--------------------
- Main Feed Routes -
--------------------
"""

# Returns the two showdown images for the day
@app.route("/showdown/getImages", methods=["GET"])
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
    return dumps({"path_one": images[0], "path_two": images[1]})


@app.route("/showdown/getwinner", methods=["GET"])
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
    return dumps({"path": path})


@app.route("/welcome/popularcontributors", methods=["GET"])
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
    return dumps(
        {
            # Returning a tuple
            "contributors": images
        }
    )


@app.route("/welcome/getPopularImages", methods=["GET"])
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
    return dumps({"popular_images": images})


"""
--------------------------
- Upload/Edit Photo Routes -
--------------------------
"""


@app.route("/user/uploadphoto", methods=["POST"])
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
    these_photo_details = request.form.to_dict()
    return dumps(create_photo_entry(these_photo_details))


@app.route("/user/updatephoto", methods=["GET"])
@validate_token
def photo_details_edit():
    """
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

    photo_id = request.args.get("photoId")
    token = request.args.get("token")

    return dumps(get_photo_edit(photo_id, token))


@app.route("/user/updatephoto", methods=["PUT"])
@validate_token
def update_photo():
    """
    Description
    -----------
    Accepts parameters related to EDITING photo details, verifies the
    parameters, creates a database entry for the photo and saves
    the photo details to backend.

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
    these_photo_details = request.form.to_dict()
    # Update either price, title, keywords or add discount
    return dumps(update_photo_details(these_photo_details))


@app.route("/user/updatephoto/deleted", methods=["GET"])
@validate_token
def check_deleted():
    """
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
    photo_id = request.args.get("photoId")
    this_photo = lib.photo.photo.Photo.objects.get(id=photo_id)
    if not this_photo or photo_id == "":
        raise Error.PhotoDNE("Could not find photo" + photo_id)

    return dumps({"deleted": this_photo.is_deleted()})


@app.route("/user/updatephoto", methods=["DELETE"])
@validate_token
def user_remove_photo():
    """
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
    """
    token = request.args.get("token")
    u_id = token_functions.get_uid(token)
    img_id = request.args.get("imgId")
    # Temporary identifier
    identifier = {"_id": ObjectId(img_id)}
    res = remove_photo(u_id, identifier)
    return dumps({"success": str(res)})


@app.route("/user/profile/uploadphoto", methods=["POST"])
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
    extension : string
    Returns
    -------
    {}
    """
    """
    TODO
    """
    token = request.form.get("token")
    img_path = request.form.get("img_path")
    extension = request.form.get("extension")
    thumbnail_and_filetype = update_user_thumbnail(img_path, extension)
    u_id = token_functions.get_uid(token)
    user = lib.user.user.User.objects.get(id=u_id)
    if not user:
        raise Error.UserDNE("Could not find user " + u_id)
    user.update_user_thumbnail(thumbnail_and_filetype)
    try:
        user.save()
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not update thumbnail")
    # Update the database...
    return dumps({"success": "True"})


"""
---------------
- Search Routes -
---------------
"""


@app.route("/search/user", methods=["GET"])
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
    orderby : string
    token : string

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

    return dumps(user_search(data))


@app.route("/search/photo", methods=["GET"])
def search_photo():
    """
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
    token : string

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

    return dumps(photo_search(data))


@app.route("/search/collection", methods=["GET"])
def search_collection():
    """
    Description
    -----------
    GET request to return many user details based on a query

    Parameters
    ----------
    query : string
    offset : int
    limit : int
    orderby : string
    token : string

    Returns
    -------
    {
        title : string,
        created_by : string,
        created: Date,
        id : string
    }
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(collection_search(data))


@app.route("/search/album", methods=["GET"])
def search_album():
    """
    Description
    -----------
    GET request to return many album details based on a query

    Parameters
    ----------
    query : string
    offset : int
    limit : int
    orderby : string
    token : string

    Returns
    -------
    {
        title : string,
        created_by : string,
        created: Date,
        id : string
    }
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(album_search(data))


"""
----------------------
- Photo Details Routes -
----------------------
"""


@app.route("/photo_details", methods=["GET"])
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
    token : string

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
        status : number (0 means not loaded yet, 1 means existing, 2 means does not exist)
        is_owner : bool
    }
    """
    photo_id = request.args.get("p_id")
    try:
        req_user = token_functions.get_uid(request.args.get("token"))
    except:
        req_user = ""
    try:
        photo = lib.photo.photo.Photo.objects.get(id=photo_id)
    except lib.photo.photo.Photo.DoesNotExist:
        print("INVALID!!!!")
        return dumps(
            {
                "u_id": "",
                "title": "",
                "likes": 0,
                "tagsList": "",
                "nickname": "",
                "email": "",
                "purchased": "",
                "photoStr": "",
                "metadata": "",
                "price": "",
                "discount": "",
                "deleted": "",
                "status": 2,
                "is_owner": False,
            }
        )
    user_purchasers = lib.user.user.User.objects(purchased=photo.id).count()
    if user_purchasers > 0:
        purchased = True
    else:
        purchased = False

    is_artist = str(photo.get_user().get_id()) == req_user

    if purchased == False and is_artist == False and photo.is_deleted() == True:
        return dumps(
            {
                "u_id": "",
                "title": "",
                "likes": "",
                "tagsList": "",
                "nickname": "",
                "email": "",
                "purchased": False,
                "metadata": "",
                "price": "",
                "discount": "",
                "deleted": photo.is_deleted(),
                "photoStr": "",
                "status": 1,
                "is_artist": is_artist,
            }
        )

    return dumps(
        {
            "u_id": str(photo.get_user().get_id()),
            "title": photo.get_title(),
            "likes": photo.get_likes(),
            "tagsList": photo.get_tags(),
            "nickname": photo.get_user().get_nickname(),
            "email": photo.get_user().get_email(),
            "purchased": purchased,
            "metadata": photo.get_metadata(),
            "price": photo.get_price(),
            "discount": photo.get_discount(),
            "deleted": photo.is_deleted(),
            "photoStr": photo.get_thumbnail(req_user),
            "status": 1,
            "is_artist": is_artist,
        }
    )


@app.route("/photo_details/isLiked", methods=["GET"])
def photo_liked():
    """
    Description
    -----------
    GET request
    dumps({"status" : 2})to retrieve information for a photo

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
    is_liked = is_photo_liked(photo_id, user_id)
    return dumps(
        {
            "isLiked": is_liked,
        }
    )


@app.route("/photo_details/updateLikes", methods=["POST"])
@validate_token
def update_likes():
    """
    Description
    -----------
    Form request that updates the likes of a photo on mongo

    Parameters
    ----------
    token: string
    photoId : string

    Returns
    -------
    {
        'liked': boolean
    }
    """
    params = request.form.to_dict()
    photo_id = params.get("photoId")
    token = params.get("token")
    print("TOKEN CALL")
    print(token)
    user_id = token_functions.get_uid(token)
    liked = like_photo(user_id, photo_id)
    return dumps({"liked": liked})


@app.route("/comments/comment", methods=["POST"])
@validate_token
def comment_on_photo():
    """
    Description
    -----------
    Adds Comments to Mongo

    Parameters
    ----------
    photoId : string
    userId : string (Commenter)
    posted : date
    content : string
    token : string (Commenter)

    Returns
    -------
    None
    """
    params = request.form.to_dict()
    photo_id = params.get("photoId")
    content = params.get("commentContent")
    token = params.get("token")
    user_id = token_functions.get_uid(token)
    
    current_date = datetime.now()
    comment_photo.comments_photo(photo_id, user_id, content, current_date)
    return dumps({})


@app.route("/comments/get_comments", methods=["GET"])
def get_comments():
    """
    Description
    -----------
    Get Comments of a photo

    Parameters
    ----------
    p_id : string
    offset : number
    limit : number (-1 if want to return all of comments)
    new_to_old : boolean

    Returns
    -------
    {
        comments: [{commenter: string,
                     comment : string,
                     datePosted : date}]
    }
    """
    photo_id = request.args.get("p_id")
    # offset = request.args.get("offset")
    # limit = request.args.get("limit")
    order = request.args.get("new_to_old")
    current_date = datetime.now()
    print(current_date)
    all_comments = get_all_comments(photo_id, current_date, order)

    return dumps({"comments": all_comments, "status": True})
    
@app.route("/comments/delete_comments", methods=["POST"])
#@validate_token
def delete_comments():
    """
    Description
    -----------
    Delete A Comment

    Parameters
    ----------
    c_id : string
    p_id : string
    token : string

    Returns
    -------
    None
    """
    params = request.form.to_dict()
    comment_id = params.get("c_id")
    photo_id = params.get("p_id")
    token = params.get("token")
    
    token_functions.verify_token(token)
    comment_photo.delete_photos(photo_id, comment_id)

    return dumps({})


@app.route("/get_current_user", methods=["GET"])
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
    if token is None:
        return dumps(
            {
                "u_id": "",
            }
        )
    u_id = token_functions.get_uid(token)
    return dumps(
        {
            "u_id": u_id,
        }
    )


"""
---------------
- Album Routes -
---------------
"""


@app.route("/albums", methods=["GET"])
@validate_token
def albums():
    """
    Description
    -----------
    Gets albums of a user

    Parameters
    ----------
    token : string

    Returns
    -------
    {
        albumList: [
            [albumId: title],
            [albumId: title]
            ...
        ]
    }
    """

    token = request.args.get("token")
    u_id = token_functions.verify_token(token)["u_id"]

    user = lib.user.user.User.objects.get(id=u_id)

    return dumps(get_albums(user))


@app.route("/albums", methods=["POST"])
@validate_token
def add_album():
    """
    Description
    -----------
    Add album to user

    Parameters
    ----------
    token : string
    title: string

    Returns
    -------
    {
        albumId: int
    }

    """
    token = request.form.get("token")
    u_id = token_functions.verify_token(token)["u_id"]
    user = lib.user.user.User.objects.get(id=u_id)
    if not user:
        raise Error.UserDNE("Could not find User " + user_uid)

    return dumps(create_album(request.form.get("title"), user))


"""
---------------
- Test Routes -
---------------
"""


@app.route("/testdecorator", methods=["GET"])
@validate_token
def test_decorator():
    """
    Testing decorator for validating token
    Use this decorator to verify the token is
    valid and matches the secret
    """
    print("YAY")
    return dumps({"success": "success"})


@app.route("/", methods=["GET"])
def basic():
    """
    Basic Test route
    """
    arguments = {"first_name": "test", "colour": "test"}
    if request.args:
        arguments = request.args
    print(arguments)
    return dumps(arguments)


if __name__ == "__main__":
    app.run(port=8001, debug=True)
