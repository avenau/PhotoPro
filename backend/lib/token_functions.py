import jwt
from jwt.exceptions import DecodeError
from jwt.exceptions import InvalidTokenError
from jwt.exceptions import InvalidSignatureError
from lib.Error import TokenError
from bson.objectid import ObjectId
from bson.errors import InvalidId

secret = "imnotsurewhattomakethis"


def get_user_details(u_id, mongo):
    # Need to convert to an ObjectId to use in the Database
    try:
        oid = ObjectId(u_id)
    except InvalidId:
        print("u_id is not a valid ObjectId. Look closely at it")
        print(u_id)
        raise TokenError("u_id is not a valid ObjectId." + u_id)

    user = mongo.db.users.find_one({"_id": oid})

    return user


def create_token(u_id):
    '''
    Create a unique JSON Web Token which is a function of
    the user's u_id and the secret defined above.
    '''
    return jwt.encode({"u_id": u_id}, secret).decode()


def verify_token(token):
    '''
    Returns the u_id of the token, otherwise raises an exception
    '''
    try:
        res = jwt.decode(token, secret)
    except InvalidSignatureError:
        print("Invalid signature" + secret)
        raise TokenError("Invalid secret")
    except DecodeError:
        print("Token failed validation")
        raise TokenError("Token failed validation")
    except InvalidTokenError:
        print("Token failed validation")
        raise TokenError("Token failed validation")
    return res


def get_uid(token):
    '''
    Return the u_id string from the token
    '''
    return verify_token(token)['u_id']
