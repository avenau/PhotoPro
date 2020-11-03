'''
Photo Likes
'''

from bson.errors import InvalidId
from bson.objectid import ObjectId
from lib.Error import UserDNE, TokenError, PhotoDNE
import lib.user.user as user
import lib.photo.photo as photo


def is_photo_liked(photo_id, user_id):
    '''
    Checks if the user have liked the photo
    @param photo_id(string): The _id of the photo
    @param user_id(string): The _id of the user that you want to check if liked
    @return True if the user has liked the photo else false
    '''
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
    if this_photo in this_user.get_likes():
        is_liked = True

    return is_liked


def like_photo(user_id, photo_id):
    '''
    Toggle like on a photo
    If photo is already liked, dislike it
    If photo is not liked, like it
    '''
    # Get the User
    this_user = lib.user.user.User.objects.get(user_id)

    # Check that the user is valid
    if not this_user:
        raise Error.UserDNE("Could not find user " + user_id)

    # Get the Photo
    this_photo = lib.photo.photo.Photo.objects.get(photo_id)

    # Check that the photo is valid
    if not this_photo:
        raise Error.PhotoDNE("Could not find photo " + photo_id)

    # If already liked, remove the like from the photo
    if this_photo in this_user.get_liked():
        this_photo.decrement_likes()
        this_user.remove_liked_photo(this_photo)
        return False
    # If not already liked, like the photo
    else:
        this_photo.increment_likes()
        this_user.add_liked_photo(this_photo)
        return True

