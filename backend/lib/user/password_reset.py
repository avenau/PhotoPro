from flask_mail import Message
from lib.Error import ValueError
from lib.user.user import User
from threading import Timer
from hashlib import md5
from random import random
import traceback


reset_codes = []


def password_reset_request(email):
    """
    Given an email address, if the user is a registered user, semd an email
    with a link that they can access temporarily to change their password
    @param: email:string
    """
    try:
        User.objects.get(email=email)
    except:
        return None

    reset_code = md5(f"{email}{random()}".encode()).hexdigest()[:6]
    reset_codes.append({"email": email, "reset_code": reset_code})

    # after 10 minutes the code will be removed
    # if it hasn't been used already
    t = Timer(600, remove_code, [email, reset_code])
    t.start()

    # Creating mail to send
    msg = Message(
        "Password Reset Request", sender="photopro.jajac@gmail.com", recipients=[email]
    )
    msg.html = (
        "<div><p>Hi,</p>"
        f"<p>\nPlease enter this code to reset your PhotoPro\
                 password</p>"
        f"<p style='font-size: 32pt'>{reset_code}</p>"
        f"<p>Do not share this code with anyone. This code will remain\
                 valid for "
        "up to 10 minutes, if the code has expired you may repeat the\
                 process and a new code will be emailed to you.</p>"
        f"<p>If you were not expecting this email, please delete it. Thank you.</p></div>"
    )

    return msg


def password_reset_reset(email, reset_code, new_password):
    """
    Reset the password of a user if the reset code is valid
    @param: email:string
    @param: reset_code:string
    @param: new_password:string
    """
    if valid_reset_code(email, reset_code):
        try:
            user = User.objects(email=email).first()
            user.set_password(new_password)
            user.save()
        except Exception:
            print("Errors... :-(")
            print(traceback.format_exc())
        remove_code(email, reset_code)
        return {}

    raise ValueError("Invalid Reset Code")


def valid_reset_code(email, reset_code):
    """
    Check if the reset code is valid
    @param: email:string
    @param: reset_code:string
    return: boolean
    """
    if reset_codes.count({"email": email, "reset_code": reset_code}) > 0:
        return True
    return False


def remove_code(email, reset_code):
    if reset_codes.count({"email": email, "reset_code": reset_code}) > 0:
        reset_codes.remove({"email": email, "reset_code": reset_code})
