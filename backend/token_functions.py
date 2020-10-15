import jwt
from jwt.exceptions import DecodeError
from jwt.exceptions import InvalidTokenError
from jwt.exceptions import InvalidSignatureError

secret = "imnotsurewhattomakethis"


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
        u_id = jwt.decode(token, secret)
    except DecodeError:
        print("Token failed validation")
        raise DecodeError
    except InvalidTokenError:
        print("Token failed validation")
        raise InvalidTokenError
    except InvalidSignatureError:
        print("Invalid signature" + secret)
        raise InvalidSignatureError

    return u_id
