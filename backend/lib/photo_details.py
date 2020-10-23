from lib.Error import UserDNE, TokenError
from bson.objectid import ObjectId
from bson.errors import InvalidId

#Modified from profile_details
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
        #TODO: Add Photo Errors
        #raise UserDNE("User not found")
    return photo