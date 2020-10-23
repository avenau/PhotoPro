from lib.Error import UserDNE, TokenError
from bson.objectid import ObjectId
from bson.errors import InvalidId

def is_photo_liked(photo_id, user_id, mongo):
    '''
    Checks if the user have liked the photo
    @param photo_id(string): The _id of the photo
    @param user_id(string): The _id of the user that you want to check if liked
    @param mongo(object): Mongo Database
    @return True if the user has liked the photo else false
    '''
    print("Photo ID: " + photo_id)
    try:
        p_oid = ObjectId(photo_id)
    except InvalidId:
        raise TokenError("photo_id is not a valid ObjectId." + photo_id)
    
    try:
        u_oid = ObjectId(user_id)
    except InvalidId:
        raise TokenError("user_id is not a valid ObjectId." + user_id)

    user = mongo.db.users.find_one({"_id": u_oid})
    if user is None:
        raise UserDNE("User not found")
    isLiked = str((p_oid in user['likes']))
    
    return isLiked

def update_likes(photo_id, user_id, like_count, mongo):
    '''
    Updates Like Count
    @param photo_id(string): The _id of the photo
    @param user_id(string): The _id of the user that you want to check if liked
    @param like_count(int): The new like count
    @param mongo(object): Mongo Database
    @return void
    '''
    pass