from Error import UserDNE, TokenError
from bson.objectid import ObjectId
from bson.errors import InvalidId


def get_user_details(u_id, mongo):
    '''
    Get the user Document straight from the mongo database
    @param u_id(string): The _id of the user
    @param mongo(object): The user collection in Mongo
    @return user(object): The user document straight from Mongo
    '''
    # Need to convert to an ObjectId to use in the Database
    try:
        oid = ObjectId(u_id)
    except InvalidId:
        print("u_id is not a valid ObjectId. Look closely at it")
        print(u_id)
        raise TokenError("u_id is not a valid ObjectId." + u_id)

    user = mongo.db.users.find_one({"_id": oid})
    if user is None:
        print("O NO!!!")
        raise UserDNE("User not found")
    return user
