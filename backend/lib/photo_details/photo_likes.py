"""
Photo Likes
"""

from bson.errors import InvalidId
from bson.objectid import ObjectId
from lib.Error import UserDNE, TokenError, PhotoDNE
from lib.popular.popular_interactions import do_like, do_unlike
import lib.user.user as user
import lib.photo.photo as photo
import lib.token_functions as token_functions
from jwt.exceptions import DecodeError
from jwt.exceptions import InvalidTokenError
from jwt.exceptions import InvalidSignatureError


def is_photo_liked(photo_id, token):
    """
    Checks if the user have liked the photo
    @param photo_id(string): The _id of the photo
    @param user_id(string): The _id of the user that you want to check if liked
    @return True if the user has liked the photo else false
    """
    try:
        user_id = token_functions.verify_token(token)["u_id"]
    except (InvalidSignatureError, DecodeError, TokenError, InvalidTokenError):
        return False

    is_liked = False
    # Get the user object
    this_user = user.User.objects.get(id=user_id)
    if not this_user:
        raise UserDNE("User does not exist " + user_id)
    # Get the photo object
    this_photo = photo.Photo.objects.get(id=photo_id)
    if not this_photo:
        raise PhotoDNE("Photo does not exist " + photo_id)
    # Check to see if the user is in the list of likes
    if this_photo in this_user.get_liked():
        is_liked = True

    return is_liked


def like_photo(token, photo_id):
    """
    Toggle like on a photo
    If photo is already liked, dislike it
    If photo is not liked, like it
    """
    user_id = token_functions.verify_token(token)["u_id"]
    # Get the User
    this_user = user.User.objects.get(id=user_id)

    # Check that the user is valid
    if not this_user:
        raise UserDNE("Could not find user " + user_id)

    # Get the Photo
    this_photo = photo.Photo.objects.get(id=photo_id)

    # Check that the photo is valid
    if not this_photo:
        raise PhotoDNE("Could not find photo " + photo_id)

    # If already liked, remove the like from the photo
    if this_photo in this_user.get_liked():
        this_photo.decrement_likes()
        this_user.remove_liked_photo(this_photo)
        this_photo.save()
        this_user.save()
        do_unlike(this_photo)
        return False
    # If not already liked, like the photo
    else:
        this_photo.increment_likes()
        this_user.add_liked_photo(this_photo)
        this_photo.save()
        this_user.save()
        do_like(this_photo)
        return True
