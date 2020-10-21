'''
Database related methods
e.g. create, update, delete
'''
from bson.objectid import ObjectId


def update_user(mongo, u_id, key, value):
    '''
    Update the user collection with a key value pair
    '''

    users = mongo.db.users.update_one(
        {'_id': ObjectId(u_id)},
        {
            "$set": {
                key: value
            }
        }
    )
    return users
