"""
Login user
"""
from ..Error import EmailError, PasswordError
from ..token_functions import create_token


def login(mongo, bcrypt, email, password):
    if email == "":
        raise EmailError("Please enter an email address.")
    if password == "":
        raise PasswordError("Please enter a password.")

    user = mongo.db.users.find_one({"email": email})
    if not user:
        raise EmailError("That email isn't registered.")
    hashedPassword = user["password"]

    u_id = ""
    token = ""
    nickname = ""
    if bcrypt.check_password_hash(hashedPassword, password):
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
