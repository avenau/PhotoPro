"""
Login user
"""

from lib.Error import EmailError, PasswordError
from lib.token_functions import create_token


def login(mongo, bcrypt, email, password):
    '''
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
    '''
    if email == "":
        raise EmailError("Please enter an email address.")
    if password == "":
        raise PasswordError("Please enter a password.")

    user = mongo.db.users.find_one({"email": email})
    if not user:
        raise EmailError("That email isn't registered.")
    hashed_password = user["password"]

    u_id = ""
    token = ""
    nickname = ""
    if bcrypt.check_password_hash(hashed_password, password):
        u_id = user["_id"]
        nickname = user["nickname"]
        token = create_token(str(u_id))
    else:
        raise PasswordError("That password is incorrect.")

    return {
        "u_id": str(u_id),
        "token": token,
        "nickname": nickname
    }
