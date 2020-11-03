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


def update_likes_mongo(photo_id, user_id, like_count, upvote, mongo):
    '''
    Updates Like Count
    @param photo_id(string): The _id of the photo
    @param user_id(string): The _id of the user that you want to check if liked
    @param like_count(int): The new like count
    @param mongo(object): Mongo Database
    @return void
    '''
    p_oid = None
    u_oid = None

    try:
        p_oid = ObjectId(photo_id)
    except InvalidId:
        raise TokenError("photo_id is not a valid ObjectId." + photo_id)

    try:
        u_oid = ObjectId(user_id)
    except InvalidId:
        raise TokenError("user_id is not a valid ObjectId." + user_id)

    photo = mongo.db.photos.find_one({"_id": p_oid})
    liker = mongo.db.users.find_one({"_id": u_oid})
    if photo is None:
        print("Photos not found")
        # TODO: Add Photo Errors
        # raise UserDNE("User not found")
    if liker is None:
        raise UserDNE("User not found")

    # Adds/Remove Photo to liker's add List
    print("Upvote " + upvote)
    if upvote == "true":
        mongo.db.users.update_one({"_id": u_oid}, {"$push": {"likes": p_oid}})
    else:
        mongo.db.users.update_one({"_id": u_oid}, {"$pull": {"likes": p_oid}})

    mongo.db.photos.update_one({"_id": p_oid}, {"$set": {"likes": like_count}})
