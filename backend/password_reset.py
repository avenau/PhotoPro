from flask_mail import Message
from Error import ValueError
from threading import Timer
from hashlib import md5
from random import random
import traceback


reset_codes = []


def password_reset_request(email):
    """
    Given an email address, if the user is a registered user, semd an email
    with a link that they can access temporarily to change their password
    """
    # TODO:
    # this needs to create some kind of reset code to authenticate password
    # changes. If possible this should be either added to an array somewhere or
    # just directly to the DB for a limited amount of time before it is either
    # used and removed or auto removed

    reset_code = md5(f"{email}{random()}".encode()).hexdigest()[:6]
    reset_codes.append({"email": email, "reset_code": reset_code})

    # after 10 minutes the code will be removed
    # if it hasn't been used already
    t = Timer(600, remove_code, [email, reset_code])
    t.start()

    # Creating mail to send
    msg = Message("Password Reset Request",
                  sender="photopro.jajac@gmail.com",
                  recipients=[email])
    msg.html = ("<div><p>Hi,</p>"
                f"<p>\nPlease enter this code to reset your PhotoPro\
                 password</p>"
                f"<p style='font-size: 32pt'>{reset_code}</p>"
                f"<p>Do not share this code with anyone. This code will remain\
                 valid for "
                "up to 10 minutes, if the code has expired you may repeat the\
                 process and a new code will be emailed to you.</p></div>")

    return msg


def password_reset_reset(email, reset_code, new_password, mongo):
    """
    TODO Contact Database
    """
    if(valid_reset_code(email, reset_code)):
        try:
            mongo.db.user.update_one({"email": email},
                                     {"$set": {"password": new_password}})
        except Exception:
            print("Errors... :-(")
            print(traceback.format_exc())
        remove_code(email, reset_code)
        return {}

    raise ValueError("Invalid Reset Code")


def valid_reset_code(email, reset_code):
    if (reset_codes.count({"email": email, "reset_code": reset_code}) > 0):
        return True
    return False


def remove_code(email, reset_code):
    reset_codes.remove({"email": email, "reset_code": reset_code})
