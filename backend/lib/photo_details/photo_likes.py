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
   # print("Photo ID: " + photo_id)
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
    isLiked = (p_oid in user['likes'])
    
    return isLiked

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
    
    #print("PHOTO ID: " + str(p_oid))
    photo = mongo.db.photos.find_one({"_id": p_oid})
    liker = mongo.db.users.find_one({"_id": u_oid})
   # print("TEST PHOTO ")
    #print(photo)
    if photo is None:
        print("Photos not found")
        # TODO: Add Photo Errors
        # raise UserDNE("User not found")
    if liker is None:
        raise UserDNE("User not found")
    
    # Adds/Remove Photo to liker's add List
    print("Upvote " + upvote)
    if (upvote == "true"):
       # print("Adding MONGO")
        mongo.db.users.update_one({"_id": u_oid}, { "$push": { "likes": p_oid } })
    else:
        #print("Deleting MONGO")
        mongo.db.users.update_one({"_id": u_oid}, { "$pull": { "likes": p_oid} })
        
    mongo.db.photos.update_one({"_id": p_oid}, {"$set": {"likes": like_count}})
    
    pass