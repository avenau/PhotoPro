'''
Photo Details
'''
from bson.errors import InvalidId
from bson.objectid import ObjectId
from lib.Error import TokenError, UserDNE
# Modified from profile_details


def get_photo_details(p_id, mongo):
    '''
    Get the Photo information from mongo
    @param p_id(string): The _id of the photo
    @param mongo(object): The photo collection in Mongo
    @return photo(object): The photo document straight from Mongo
    '''

    try:
        oid = ObjectId(p_id)
    except InvalidId:
        raise TokenError("p_id is not a valid ObjectId." + p_id)

    photo = mongo.db.photos.find_one({"_id": oid})
    if photo is None:
        print("Photos not found")
        # TODO: Add Photo Errors
        # raise UserDNE("User not found")
    return photo


def is_photo_purchased(p_id, u_id, mongo):
    '''
    Get the Photo information from mongo
    @param p_id(string): The _id of the photo
    @param u_id(string): The _id of the user
    @param mongo(object): The photo collection in Mongo
    @return isPurchased(boolean): Returns whether user has purchased the photo
    '''

    try:
        u_oid = ObjectId(u_id)
    except InvalidId:
        raise TokenError("u_id is not a valid ObjectId." + u_id)

    try:
        p_oid = ObjectId(p_id)
    except InvalidId:
        raise TokenError("p_id is not a valid ObjectId." + p_id)

    user = mongo.db.users.find_one({"_id": u_oid})
    if user is None:
        # TODO: Add Photo Errors
        raise UserDNE("User not found")

    is_purchased = (p_oid in user['purchased'])
    return is_purchased
