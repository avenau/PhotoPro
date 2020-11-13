"""
Login user
"""

import traceback
from lib.Error import EmailError, PasswordError
from lib.token_functions import create_token
import lib.user.user


def login(bcrypt, email, password):
    """
    Login the user
    1) Email Validation
    2) Password validation
    3) Check the database for the email
    4) Check password hash
    5) Return user object
    @param mongo: pymongo database
    @param bcrypt: flask_bcrypt object
    @param email: string
    @param password: binary
    @return user: {u_id: string, token: string, nickname: string}
    """
    user = lib.user.user.User.objects(email=email).first()
    if not user:
        raise EmailError("That email isn't registered.")
    hashed_password = user.get_password()
    try:
        if bcrypt.check_password_hash(hashed_password, password):
            u_id = user.get_id()
            nickname = user.get_nickname()
            token = create_token(str(user.get_id()))
        else:
            print(traceback.format_exc())
            raise PasswordError("That password is incorrect.")
    except:
        print(traceback.format_exc())
        raise PasswordError("That password is incorrect.")

    return {"u_id": str(u_id), "token": token, "nickname": nickname}
