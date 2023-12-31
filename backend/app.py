"""
Backend main file
Handle requests to and from server and web app client
 - Team JAJAC :)
"""

# Pip functions
import traceback
from json import dumps, loads
import mongoengine
from mongoengine import PULL
from bson.objectid import ObjectId, InvalidId
from flask import Flask, request
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail
from werkzeug.exceptions import HTTPException

# Classes
import lib.photo.photo as photo
import lib.showdown.participant as participant
import lib.showdown.showdown as showdown
import lib.user.user as user
import lib.catalogue.catalogue as catalogue
import lib.collection.collection as collection
import lib.album.album as album
import lib.comment.comment as comment

# Delete rules
album.Album.register_delete_rule(user.User, "albums", PULL)
album.Album.register_delete_rule(photo.Photo, "albums", PULL)
collection.Collection.register_delete_rule(user.User, "collections", PULL)
collection.Collection.register_delete_rule(photo.Photo, "collections", PULL)

# JAJAC made functions

# Collections
import lib.collection.collection_functions as collection_functions

# Albums
from lib.album.album_edit import create_album, get_albums
from lib.album.album_functions import (
    update_album,
    album_photo_search,
    catalogue_thumbnail,
)
from lib.album.album_purchase import purchase_album, get_price

# Comments
import lib.comment.comment_photo as comment_photo
from lib.photo_details.photo_details import get_all_comments
from datetime import datetime

# Photo
from lib.photo.photo_edit import create_photo_entry, update_photo_details
from lib.photo.photo_edit import get_photo_edit
from lib.photo.remove_photo import remove_photo

# Photo details
from lib.photo_details.photo_details import (
    photo_detail_results,
    is_photo_liked,
    like_photo,
)

# Profile
from lib.profile.upload_photo import update_user_thumbnail
from lib.profile.profile_details import (
    get_profile_details,
    user_album_search,
    user_collection_search,
    user_following_search,
    user_photo_search,
)

# Search
from lib.search.search import album_search, photo_search, user_search, collection_search

# Showdown
import lib.showdown.get_data as showdown_data

# Schedule
from lib.schedule.schedule import initialise_schedule, end_showdown

# User
from lib.user.validate_login import login
import lib.user.helper_functions
import lib.user.password_reset as password_reset
from lib.user.helper_functions import update_follow  # , is_following

# Purchases
from lib.purchases.purchases import get_purchased_photos

# Welcome
from lib.welcome.recommend import recommend_photos
from lib.welcome.contributors import get_popular_contributors_images
from lib.welcome.popular_images import get_popular_images

# Other/utils
from lib.token_decorator import validate_token
import lib.token_functions as token_functions
from lib import Error
import lib
from lib.token_functions import get_uid

# Config
from config import DevelopmentConfig, ProductionConfig, defaultHandler


app = Flask(__name__)
app.config.from_object(ProductionConfig)
app.register_error_handler(Error.CustomError, defaultHandler)
CORS(app)
bcrypt = Bcrypt(app)
mongoengine.connect("angular-flask-muckaround", host=app.config["MONGO_URI"])

initialise_schedule(app.config["SHOWDOWN_LENGTH"])

"""
--------------------------
- Account Management Routes -
--------------------------
"""


@app.route("/verifytoken", methods=["GET"])
def _verify_token():
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
def _process_login():
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
def _auth_password_reset_request():
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
    if msg != None:
        mail = Mail(app)
        mail.send(msg)

    return dumps({})


@app.route("/passwordreset/reset", methods=["POST"])
def _auth_passwordreset_reset():
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
        password_reset.password_reset_reset(email, reset_code, hashed_password)
    )


@app.route("/accountregistration", methods=["POST"])
def _account_registration():
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

    this_user = user.User(
        fname=new_user["fname"],
        lname=new_user["lname"],
        email=new_user["email"],
        nickname=new_user["nickname"],
        password=new_user["password"],
        profile_pic=new_user["profilePic"],
        location=new_user["location"],
        about_me=new_user["aboutMe"],
        created=datetime.now(),
    )
    try:
        this_user.save()
    except mongoengine.errors.NotUniqueError:
        print(traceback.format_exc())
        raise Error.ValidationError("Email address is already registered")

    return dumps(
        {
            "id": str(this_user.get_id()),
            "token": token_functions.create_token(str(this_user.get_id())),
            "nickname": this_user.get_nickname(),
        }
    )


@app.route("/userdetails", methods=["GET"])
@validate_token
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
    fname:str
    lname:str
    nickname:str
    email:str
    DOB:str
    location:str
    aboutMe:str
    """
    token = request.args.get("token")
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


@app.route("/user/credits", methods=["GET"])
@validate_token
def _get_credits():
    """
    Description
    -----------
    Return credits for given user.

    Parameters
    ----------
    token : string

    Returns
    -------
    credits: int

    """
    token = request.args.get("token")
    u_id = token_functions.get_uid(token)
    this_user = user.User.objects.get(id=u_id)
    if not this_user:
        raise Error.UserDNE("Could not find user")

    return dumps({"credits": this_user.get_credits()})


@app.route("/manageaccount/success", methods=["POST"])
@validate_token
def manage_account():
    """
    Description
    -----------
    Takes a user object and updates key:value pairs in the database

    Parameters
    ----------
    u_id: string,
    password: string,
    profilePic: string
    ...

    Returns
    -------
    success: boolean
    nickname: string
    """
    success = False
    data = request.form.to_dict()
    u_id = token_functions.get_uid(data["token"])
    this_user = lib.user.user.User.objects.get(id=u_id)

    if data.get("profilePic") != "":
        data["profilePic"] = update_user_thumbnail(
            data["profilePic"], data["extension"]
        )
    else:
        data["profilePic"] = ["", ""]

    if this_user is None:
        raise Error.UserDNE("User with id " + this_user + "does not exist")
    try:
        for key, value in data.items():
            lib.user.helper_functions.update_value(bcrypt, this_user, key, value)
        success = True
    except Exception as e:
        print("Errors... :-(")
        print(traceback.format_exc())
        success = False
        raise e

    if "nickname" in data:
        nickname = data["nickname"]
    else:
        nickname = None

    return dumps({"success": success, "nickname": nickname})


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

    return data


@app.route("/userdetails", methods=["GET"])
@validate_token
def _user_info_with_token():
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
    u_id = token_functions.get_uid(token)
    this_user = user.User.objects.get(id=u_id)
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


"""
--------------------
- Profile Routes -
--------------------
"""


@app.route("/profiledetails", methods=["GET"])
def _profile_details():
    """
    Description
    -----------
    Get all details of a user's details for their profile page

    Parameters
    ----------
    token: str (token of the profile viewer),
    u_id : str (id of the profile owner)

    Returns
    -------
    fname: string
    lname: string
    nickname: string
    location: string
    email: string
    profilePic: string
    aboutMe: string
    following: boolean
    contributor: string
    -------
    """
    data = request.args.to_dict()
    return dumps(get_profile_details(data))


@app.route("/collection/thumbnail", methods=["GET"])
def _collection_thumbnail():
    """
    Get first photo from collection to use a thumbnail
    Parameters
    ----------
    token: str (token of the profile viewer),
    albumId: string

    Returns
    -------
    thumbnail: string
    """
    collection_id = request.args.get("albumId")
    _collection = lib.collection.collection.Collection.objects.get(id=collection_id)
    try:
        u_id = get_uid(request.args.get("token"))
    except:
        u_id = ""
    return dumps(catalogue_thumbnail(_collection, u_id))


"""
--------------------
- Purchases Routes -
--------------------
"""


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
    List of
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
    List of
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
    List of
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
@validate_token
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
    List of
    {
        id : string
        nickname : string
        fname : string
        lname : string
        email : string
        location : string
        profilePic: string[]
        following: bool
    }
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(user_following_search(data))


@app.route("/user/follow", methods=["POST"])
@validate_token
def _follow():
    """
    Description
    -----------
    POST request to update following or unfollowing a user

    Parameters
    ----------
    token : string
    followed_u_id : string (User Id of the user being followed)

    Returns
    -------
    {}
    """
    token = request.form.get("token")
    followed_u_id = request.form.get("followed_u_id")
    followed = update_follow(token, followed_u_id)
    return dumps({"followed": followed})


@app.route("/user/purchasedphotos", methods=["GET"])
@validate_token
def _get_purchased_photos_from_user():
    """
    Description
    -----------
    GET request to return photos purchased by user, including deleted ones.

    Parameters
    ----------
    offset : int
    limit : int
    token : string
    query : string

    Returns
    -------
    List of
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
    return dumps(get_purchased_photos(data))


"""
--------------------
- Purchases Routes -
--------------------
"""


@app.route("/purchases/buycredits", methods=["POST"])
@validate_token
def _buy_credits():
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
    credits_bought: int
    """
    token = request.form.get("token")
    user_id = token_functions.get_uid(token)
    credits_to_add = int(request.form.get("ncredits"))

    this_user = user.User.objects.get(id=user_id)

    this_user.add_credits(credits_to_add)
    this_user.save()

    return dumps({"credits_bought": credits_to_add})


@app.route("/purchases/refundcredits", methods=["POST"])
@validate_token
def _refund_credits():
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
    credits_refunded: int
    """
    token = request.form.get("token")
    user_id = token_functions.get_uid(token)
    credits_to_refund = int(request.form.get("ncredits"))

    this_user = user.User.objects.get(id=user_id)
    this_user.remove_credits(credits_to_refund)
    try:
        this_user.save()
    except mongoengine.ValidationError:
        raise Error.ValidationError("User has insufficient credits")

    return dumps({"credits_refunded": credits_to_refund})


@app.route("/purchasephoto", methods=["POST"])
@validate_token
def buy_photo():
    """
    Description
    -----------
    User buys photo.

    Parameters
    ----------
    token: str,
    photoId: str

    Returns
    -------
    bought: boolean
    """
    token = request.form.get("token")
    try:
        user_id = token_functions.get_uid(token)
    except:
        raise Error.ValidationError("You need to log in to purchase a photo.")

    photo_id = request.form.get("photoId")
    buyer = lib.user.user.User.objects.get(id=user_id)
    this_photo = lib.photo.photo.Photo.objects.get(id=photo_id)
    seller = lib.user.user.User.objects.get(id=this_photo.get_user().get_id())
    photo_price = this_photo.get_discounted_price()
    user_credits = buyer.get_credits()

    # Catch invalid actions
    if this_photo in buyer.get_purchased():
        raise Error.ValidationError(
            "You can't purchase a photo that you've already purchased'."
        )
    elif this_photo.is_photo_owner(buyer):
        raise Error.ValidationError(
            "You can't purchase a photo that you posted yourself."
        )
    elif this_photo.is_deleted():
        raise Error.ValidationError("You can't purchase a deleted photo.")
    elif photo_price > user_credits:
        raise Error.ValueError(
            "You don't have enough credits. Buy more at the purchases tab :)"
        )

    # Do the purchase
    buyer.remove_credits(photo_price)
    buyer.add_purchased(this_photo)
    buyer.save()

    # Seller gets 80% of profits. Photopro takes 20%
    seller.add_credits(int(0.80 * photo_price))
    seller.save()

    metadata, photoStr = this_photo.get_thumbnail(user_id)

    return dumps({"metadata": metadata, "photoStr": photoStr, "purchased": True})


@app.route("/purchasealbum", methods=["POST"])
@validate_token
def buy_album():
    """
    Description
    -----------
    User buys photos in album which they do not already own.

    Parameters
    ----------
    token: str,
    albumId: str

    Returns
    -------
    bought: boolean
    """
    token = request.form.get("token")
    try:
        user_id = token_functions.get_uid(token)
        album_id = request.form.get("albumId")
    except:
        raise Error.ValidationError("You need to log in to purchase an album.")

    return dumps(purchase_album(user_id, album_id))


@app.route("/download", methods=["GET"])
def download_full_photo():
    """
    Description
    -----------
    Download full-res photo identified by photo_id.
    Returns watermarked or non-watermarked image depending on the token's u_id.

    Parameters
    ----------
    token: str
    photo_id: str

    Returns
    -------
    metadata: str
    base64_img: str
    extension: str
    """
    token = request.args.get("token")
    photo_id = request.args.get("photoId")
    try:
        req_user = token_functions.get_uid(token)
    except:
        req_user = ""

    requested_photo_object = lib.photo.photo.Photo.objects.get(id=photo_id)
    (
        requested_metadata,
        requested_b64,
        requested_extension,
    ) = requested_photo_object.get_full_image(req_user)

    return dumps(
        {
            "metadata": requested_metadata,
            "base64_img": requested_b64,
            "extension": requested_extension,
        }
    )


"""
--------------------
- Showdown Routes -
--------------------
"""


@app.route("/showdown", methods=["GET"])
def _get_showdown():
    """
    Description
    -----------
    Get details about the currently running showdown

    Parameters
    ----------
    token: string

    Returns
    -------
    participants: object[],
    prevWinnerPhoto: object,
    currentVote: string <- either participant id or empty
    """
    token = request.args.get("token")
    try:
        req_user = token_functions.get_uid(token)
    except:
        req_user = ""

    return dumps(showdown_data.get_data(req_user))


@app.route("/showdown/updatelikes", methods=["POST"])
@validate_token
def _update_likes():
    """
    Description
    -----------
    Update Likes for showdown photos

    Parameters
    ----------
    part_id : string (Participating id)
    token : string

    Returns
    -------
    votes : number
    """
    token = request.form.get("token")
    part_id = request.form.get("part_id")
    try:
        u_id = token_functions.get_uid(token)
        _user = user.User.objects.get(id=u_id)
    except Exception:
        raise Error.TokenError("Invalid token, please log in to PhotoPro again")

    try:
        _participant = participant.Participant.objects.get(id=part_id)
    except Exception:
        raise Error.ValueError("Showdown Participant does not exist")

    participants = _participant.get_showdown().get_participants()
    participants.remove(_participant)
    _participant2 = participants[0]

    if _user in _participant.get_votes():
        _participant.remove_vote(_user)
    else:
        _participant.add_vote(_user)
        _participant2.remove_vote(_user)

    _participant.save()
    _participant2.save()
    return dumps(
        {
            "votes": _participant.count_votes(),
        }
    )


@app.route("/showdownwins/<string:type>", methods=["GET"])
def _count_showdown_wins(type):
    """
    Description
    -----------
    Count how many times a user or photo has won a showdown

    Parameters
    ----------
    id : string (Id to compare with showdown wins)

    Returns
    -------
    wins : number
    """
    id = request.args.get("id")
    wins = 0

    try:
        if type == "user":
            wins = showdown_data.count_wins_user(id)
        elif type == "photo":
            wins = showdown_data.count_wins_photo(id)
    except:
        wins = 0

    return dumps(
        {
            "wins": wins,
        }
    )


@app.route("/showdown/end", methods=["GET"])
def _end_showdown():
    """
    Description
    -----------
    NOTICE - THIS SHOULD ONLY BE USED IN DEMONSTRATIONS AND TESTING. IN
    A PRODUCTION ENVIRONMENT THIS ENDPOINT SHOULD BE REMOVED OR SECURED

    End the currently running showdown - this also resets
    popular contributor and photo counters

    Parameters
    ----------
    None

    Returns
    -------
    {}
    """
    end_showdown()
    initialise_schedule(app.config["SHOWDOWN_LENGTH"])
    return dumps({})


"""
--------------------
- Main Feed Routes -
--------------------
"""


@app.route("/welcome/popularcontributors", methods=["GET"])
def _welcome_get_contributors():
    """
    Description
    -----------
    Get some contributor profile pictures

    Parameters
    ----------
    offset: number
    limit: number

    Returns
    -------
    [{
        name: string
        artistImg : string
        user : string (id)
    }]
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])
    return dumps(get_popular_contributors_images(data["offset"], data["limit"]))


@app.route("/welcome/getPopularImages", methods=["GET"])
def _welcome_get_popular_images():
    """
    Description
    -----------
    Get paths of popular images

    Parameters
    ----------
    token: str

    Returns
    -------
    [{
        title : string
        price : int
        discount : int
        photoStr : string
        metadata : string
        likes: int
        owns: boolean
        id : string
    }]
    """
    data = request.args.to_dict()
    try:
        u_id = get_uid(data["token"])
    except:
        u_id = ""
    offset = int(data["offset"])
    limit = int(data["limit"])
    return dumps(get_popular_images(u_id, offset, limit))


@app.route("/welcome/recommend", methods=["GET"])
@validate_token
def welcome_recommend_photos():
    """
    Description
    -----------
    Get recommended photos for a registered user.

    Parameters
    ----------
    query : string[]
    offset : int
    limit : int
    orderby : string
    token : string

    Returns
    -------
    [{
        title : string
        price : int
        discount : int
        photoStr : string
        metadata : string
        id : string
    }]
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])
    return dumps(recommend_photos(data))


"""
--------------------------
- Upload/Edit Photo Routes -
--------------------------
"""


@app.route("/user/uploadphoto", methods=["POST"])
@validate_token
def _upload_actual_photo():
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
def _photo_details_edit():
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
    success: boolean
    """

    photo_id = request.args.get("photoId")
    token = request.args.get("token")

    return dumps(get_photo_edit(photo_id, token))


@app.route("/user/updatephoto", methods=["PUT"])
@validate_token
def _update_photo():
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
    success: boolean
    """
    these_photo_details = request.form.to_dict()
    # Update either price, title, keywords or add discount
    return dumps(update_photo_details(these_photo_details))


@app.route("/user/updatephoto/deleted", methods=["GET"])
@validate_token
def _check_deleted():
    """
    Description
    -----------
    Check if the photo is marked as deleted. This ensures they cannot
    edit a photo which has been deleted

    Parameters
    ----------
    photoId: str

     Returns
    -------
    deleted: boolean
    """
    photo_id = request.args.get("photoId")
    this_photo = lib.photo.photo.Photo.objects.get(id=photo_id)
    if not this_photo or photo_id == "":
        raise Error.PhotoDNE("Could not find photo" + photo_id)

    return dumps({"deleted": this_photo.is_deleted()})


@app.route("/user/updatephoto", methods=["DELETE"])
@validate_token
def _user_remove_photo():
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
    success: boolean
    """
    token = request.args.get("token")
    u_id = token_functions.get_uid(token)
    img_id = request.args.get("imgId")
    # Temporary identifier
    identifier = {"_id": ObjectId(img_id)}
    res = remove_photo(u_id, identifier)
    return dumps({"success": str(res)})


"""
---------------
- Search Routes -
---------------
"""


@app.route("/search/user", methods=["GET"])
def _search_user():
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
    token: string

    Returns
    -------
    [{
        fname: str,
        lname: str,
        nickname: str,
        email: str,
        location: str,
        profilePic: str[],
        id: str,
        following: bool,
    }]
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(user_search(data))


@app.route("/search/photo", methods=["GET"])
def _search_photo():
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
    [{
        title : string
        price : int
        discount : int
        photoStr : string
        metadata : string
        id : string
    }]
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(photo_search(data))


@app.route("/search/collection", methods=["GET"])
def _search_collection():
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
    [{
        title : string,
        created_by : string,
        created: Date,
        id : string
    }]
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(collection_search(data))


@app.route("/search/album", methods=["GET"])
def _search_album():
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
    [{
        title : string,
        created_by : string,
        created: Date,
        id : string,
        authorId: string,
        discount : int
    }]
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


@app.route("/photodetailspage", methods=["GET"])
def _photo_details_page():
    """
    Description
    -----------
    GET request to retrieve information for the photo details page.
    Should not be called by anything except the photo details page.

    Parameters
    ----------
    p_id : string
    token : string

    Returns
    -------
    {
        artist_id: str,
        artist_nickname: str,
        artist_email: str
        title: str,
        price: int,
        discount: int,
        posted: str (Format 'YYYY-MM-DD'),
        n_likes: int,
        tagsList: str[],
        purchased: bool,
        metadata: str,
        photoStr: str,
        deleted: bool
        is_artist : bool
        comments: Comment[]
    }
    """
    photo_id = request.args.get("p_id")
    token = request.args.get("token")
    return photo_detail_results(photo_id, token)


@app.route("/comments/get_comments", methods=["GET"])
def _get_comments():
    """
    Description
    -----------
    Get Comments of a photo

    Parameters
    ----------
    p_id : string
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
    order = request.args.get("new_to_old")
    current_date = datetime.now()
    all_comments = get_all_comments(photo_id, current_date, order)

    return dumps({"comments": all_comments, "status": True})


@app.route("/photo_details/isLiked", methods=["GET"])
@validate_token
def _photo_liked():
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
    liked: boolean
    """
    photo_id = request.args.get("p_id")
    token = request.args.get("token")
    is_liked = is_photo_liked(photo_id, token)
    return dumps({"isLiked": is_liked})


@app.route("/photo_details/like_photo", methods=["POST"])
@validate_token
def _like_photo():
    """
    Description
    -----------
    Updates likes and link it to Mongo

    Parameters
    ----------
    token: string
    photoId : string

    Returns
    -------
    {}
    """
    photo_id = request.form.get("photoId")
    token = request.form.get("token")
    logged_in = True
    try:
        u_id = token_functions.get_uid(token)
    except:
        u_id = ""
        logged_in = False

    liked = like_photo(u_id, photo_id)
    return dumps({"liked": liked, "loggedIn": logged_in})


@app.route("/comments/postcomment", methods=["POST"])
@validate_token
def _comment_on_photo():
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


@app.route("/comments/delete_comments", methods=["POST"])
# @validate_token
def _delete_comments():
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


"""
---------------------
- Collection Routes -
---------------------
"""


@app.route("/collection/get", methods=["GET"])
@validate_token
def _get_collection():
    """
    Description
    -----------
    Get a Collection as a json object

    Parameters
    ----------
    token: string
    collectionId: string

    Returns
    ----------
    {
        title: string,
        private: boolean,
        price, int
        tags: [string],
        price: int,
        originalPrice: int
    }
    """
    token = request.args.get("token")
    collection_id = request.args.get("collectionId")
    _user = user.User.objects.get(id=token_functions.get_uid(token))
    _collection = collection.Collection.objects.get(id=collection_id)
    owns = _collection.get_created_by() == _user
    if _collection.is_private() and _collection.get_created_by() != _user:
        return dumps({}), 401

    return dumps(
        {
            "title": _collection.get_title(),
            "private": _collection.is_private(),
            "tags": _collection.get_tags(),
            "isOwner": owns,
            "owner": str(_collection.get_created_by().get_id()),
            "nickname": _collection.get_created_by().get_nickname(),
        }
    )


@app.route("/collection/getall", methods=["GET"])
def _get_all_collections():
    """
    Description
    -----------
    For a given user_id, get all collections associated

    Parameters
    ----------
    token: token
    photoId: string

    Returns
    ------
    [{
        title: string,
        creation_date: datetime,
        deleted: boolean,
        private: boolean,
        price, int
        tags: [string],
        photoExists: boolean
    }]
    """
    json_collection = collection_functions.get_all_collections(request.args)
    response = []
    for entry in loads(json_collection):
        response.append(
            {
                "title": entry["title"],
                "id": entry["id"],
                "photoExists": entry["photoExists"],
            }
        )
    return dumps(response)


@app.route("/collection/add", methods=["POST"])
@validate_token
def _create_collection():
    """
    Description
    -----------
    Create a new collection

    Parameters
    ----------
    token: string
    title: string,
    tags: JSON([string]),

    Returns
    ----------
    'collection_id': string
    """
    # Get Parameters
    params = request.form.to_dict()
    u_id = token_functions.get_uid(params["token"])
    # Get Objects
    _user = user.User.objects.get(id=u_id)
    new_collection = collection_functions.create_collection(_user, params)

    # Return Collection ID
    return dumps(new_collection)


@app.route("/collection/update", methods=["PUT"])
@validate_token
def _update_collection():
    """
    Update Collection with the following parameters

    Parameters
    ----------
    token: string
    collectionId: string
    title: string
    private: boolean
    tags: string[]

    Returns
    ----------
    None
    """
    params = request.form.to_dict()
    token = params["token"]
    collection_id = params["collectionId"]
    u_id = token_functions.get_uid(token)

    _user = user.User.objects.get(id=u_id)
    if not _user:
        raise Error.UserDNE("Could not find user")
    _collection = collection.Collection.objects.get(id=collection_id)
    if not _collection:
        raise Error.ValueError("Could not find Collection")
    if _user != _collection.get_created_by():
        raise PermissionError("User not permitted to edit this Collection")

    collection_functions.update_collection(params, _collection)
    return dumps({})


@app.route("/collection/delete", methods=["DELETE"])
@validate_token
def _delete_collection():
    """
    Description
    -----------
    Create a new collection

    Parameters
    ----------
    token: string
    _id: string

    Returns
    ----------
    collection_id': string
    """
    # Get arguments
    u_id = token_functions.get_uid(request.args.get("token"))
    collection_id = request.args.get("_id")
    # Get Objects
    _user = user.User.objects.get(id=u_id)
    _collection = collection.Collection.objects.get(id=collection_id)

    # Return success
    ret = collection_functions.delete_collection(_user, _collection)
    return dumps({"success": ret})


@app.route("/collection/photos", methods=["GET"])
@validate_token
def _get_collection_photos():
    """
    Description
    -----------
    Get collection's photos from a collection id.

    Parameters
    ----------
    token: string
    query: collectionId
    offset: string
    limit: string


    Returns
    ----------
    [{
        title : string
        price : int
        discount : int
        photoStr : string
        metadata : string
        id : string
    }]
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(collection_functions.collection_photo_search(data))


@app.route("/collection/updatephotos", methods=["PUT"])
@validate_token
def _add_collection_photo():
    """
    Description
    -----------
    Add a photo to the collection
    Hacky collection update. Remove photo from all collections,
    Add photo to collections in collectionlist

    Parameters
    ----------
    token: string
    collectionIds: []string
    photoId: string

    Returns
    ----------
    success: boolean
    """

    # Get arguments
    params = request.form.to_dict()
    u_id = token_functions.get_uid(params["token"])
    collection_ids = loads(params["collectionIds"])
    photo_id = params["photoId"]
    new_collections = []

    _photo = photo.Photo.objects.get(id=photo_id)
    _user = user.User.objects.get(id=u_id)
    for _col in _user.get_collections():
        new_collections.append(
            {"title": _col.get_title(), "id": str(_col.get_id()), "photoExists": False}
        )
        if _photo in _col.get_photos():
            _col.remove_photo(_photo)
        if str(_col.get_id()) in collection_ids:
            collection_functions.add_collection_photo(_user, _photo, _col)
            new_collections[-1]["photoExists"] = True

    return dumps(new_collections)


"""
---------------
- Album Routes -
---------------
"""


@app.route("/album", methods=["GET"])
@validate_token
def _get_album():
    """
    Description
    -----------
    Get a single album's details based on an albumId

    Parameters
    ----------

    token: string
    albumId: string

    Returns
    -------

    title: string
    discount: integer
    tags: [string]
    """

    token = request.args.get("token")
    album_id = request.args.get("album_id")
    _user = user.User.objects.get(id=token_functions.get_uid(token))
    _album = album.Album.objects.get(id=request.args.get("album_id"))

    purchased = all(
        alb_photo in _user.get_purchased() for alb_photo in _album.get_photos()
    )

    return {
        "title": _album.get_title(),
        "discount": _album.get_discount(),
        "tags": _album.get_tags(),
        "albumId": album_id,
        "owner": str(_album.get_created_by().get_id()),
        "nickname": str(_album.get_created_by().get_nickname()),
        "purchased": purchased,
    }


@app.route("/album/thumbnail", methods=["GET"])
def _album_thumbnail():
    """
    Description
    ----------
    Return thumbnail of first photo from an album to use as
    the thumbnail for an album

    Parameters
    ----------
    albumId: string
    token: string

    Returns
    ----------
    thumbnail: string
    """
    album_id = request.args.get("albumId")
    _album = lib.album.album.Album.objects.get(id=album_id)

    try:
        u_id = get_uid(request.args.get("token"))
    except:
        u_id = ""
    return dumps(catalogue_thumbnail(_album, u_id))


@app.route("/album/delete", methods=["DELETE"])
@validate_token
def _delete_album():
    """
    Description
    ----------
    Given an albumId, delete an album

    Parameters
    ----------
    albumId: string
    token: string
    _id: string

    Returns
    ----------
    success: boolean
    """
    token = request.args.get("token")
    u_id = token_functions.get_uid(token)
    album_id = request.args.get("_id")

    _user = user.User.objects.get(id=u_id)
    _album = album.Album.objects.get(id=album_id)
    if _album.get_created_by() != _user:
        raise Error.ValidationError("User does not have permission to delete")
    _album.delete()
    return dumps({"success": True})


@app.route("/album/price", methods=["GET"])
@validate_token
def _get_price():
    """
    Description
    ----------
    Given an albumId, get the price of the album for the user

    Parameters
    ----------
    albumId: string
    token: string

    Returns
    ----------
    yourPrice: string,
    albumPrice: string,
    rawAlbumDiscount: string,
    savings: string,
    """
    token = request.args.get("token")
    album_id = request.args.get("albumId")
    _user = user.User.objects.get(id=token_functions.get_uid(token))
    _album = album.Album.objects.get(id=album_id)

    return dumps(get_price(_user, _album))


@app.route("/album/photos", methods=["GET"])
@validate_token
def _get_album_photos():
    """
    Description
    -----------
    GET request to return photos in a particular album

    Parameters
    ----------
    offset : int
    limit : int
    token : string
    query : string

    Returns
    -------
    [{
        title : string
        price : int
        discount : int
        photoStr : string
        metadata : string
        id : string
    }]
    """
    data = request.args.to_dict()
    data["offset"] = int(data["offset"])
    data["limit"] = int(data["limit"])

    return dumps(album_photo_search(data))


@app.route("/albums", methods=["GET"])
@validate_token
def _albums():
    """
    Description
    -----------
    Gets albums of a user. Used when creating albums and adding photos to albums.

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

    _user = user.User.objects.get(id=u_id)

    return dumps(get_albums(_user))


@app.route("/album/add", methods=["POST"])
@validate_token
def _add_album():
    """
    Description
    -----------
    Add new album to user object

    Parameters
    ----------
    token : string
    title: string

    Returns
    -------
    albumId: string
    """
    token = request.form.get("token")
    u_id = token_functions.verify_token(token)["u_id"]
    _user = lib.user.user.User.objects.get(id=u_id)
    if not _user:
        raise Error.UserDNE("Could not find User " + u_id)

    return dumps(create_album(request.form.get("title"), _user))


@app.route("/albums/update", methods=["PUT"])
@validate_token
def _update_album():
    """
    Description
    -----------
    Update album details to user

    Parameters
    ----------
    token : string
    albumId : string
    title: string
    discount: integer
    tags: list[]

    Returns
    -------
    None

    """
    # Get Parameters
    params = request.form.to_dict()
    u_id = token_functions.get_uid(params["token"])
    album_id = params["albumId"]
    # Get Objects
    _user = user.User.objects.get(id=u_id)
    _album = album.Album.objects.get(id=album_id)
    if _album.get_created_by() != _user:
        raise Error.ValidationError("User does not have permission to edit album")
    ret = update_album(
        _album, params["title"], params["discount"], loads(params["tags"])
    )

    return {"success": "true"} if ret else {"success": "false"}


if __name__ == "__main__":
    app.run(port=8001, debug=True)
