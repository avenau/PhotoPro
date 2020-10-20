'''
Database related methods
e.g. create, update, delete
'''


def update_user(mongo, u_id, key, value):
    '''
    Update the user collection with a key value pair
    '''

    users = mongo.db.users
    user = users.find_one({'u_id': u_id})
    user[key] = value
