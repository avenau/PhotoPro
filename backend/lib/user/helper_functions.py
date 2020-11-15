"""
User helper functions
"""

from lib.profile.upload_photo import update_user_thumbnail
import lib.Error as Error
from jwt.exceptions import DecodeError, InvalidTokenError, InvalidSignatureError
import lib.token_functions as token_functions
import lib.user.user as user


def update_value(bcrypt, user, key, value):
    """
    Update the key/value pair in the database of a user
    mongoengine reimplementation
    Update this list as necessary
    @param: bcrypt:bcrypt obj
    @param: user:Document.user
    @param: key:string
    @param: value:string
    """

    if key == "fname":
        user.set_fname(value)
    elif key == "lname":
        user.set_lname(value)
    elif key == "email":
        try:
            user.set_email(value)
            user.save()
        except:
            raise Error.ValueError("An account is already registered with this email.")

    elif key == "nickname":
        user.set_nickname(value)
    elif key == "password":
        hashed_password = bcrypt.generate_password_hash(value)
        user.set_password(hashed_password)
    elif key == "aboutMe":
        user.set_about_me(value)
    elif key == "location":
        user.set_location(value)
    elif key == "profilePic":
        user.set_profile_pic(value)

    user.save()


def update_follow(token, followed_id):
    """
    User with token 'token' follows user with id 'followed_id'.
    Returns True if action is follow, False if action is unfollow.
    @param: token:string
    @param: followed_id:string
    return: boolean
    """
    try:
        user_id = token_functions.get_uid(token)
    except (InvalidSignatureError, DecodeError, Error.TokenError, InvalidTokenError):
        raise Error.AccessError("You must be logged in to follow!")

    try:
        followed_user = user.User.objects.get(id=followed_id)
    except:
        raise Error.UserDNE("User with ID " + followed_id + " doesn't exist")

    try:
        following_user = user.User.objects.get(id=user_id)
    except:
        raise Error.UserDNE("Your user ID " + user_id + " doesn't exist")

    if is_following(following_user, followed_user) == False:
        following_user.add_following(followed_user)
        following_user.save()
        followed = True
    else:
        following_user.remove_following(followed_user)
        following_user.save()
        followed = False

    return followed


def is_following(follower, followed):
    return followed in follower.get_following()
