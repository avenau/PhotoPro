from flask_mail import Message

def password_reset_request(email):
    """
    Given an email address, if the user is a registered user, semd an email
    with a link that they can access temporarily to change their password
    """
    # TODO this needs to create some kind of code to authenticate password
    # changes. If possible this should be either added to an array somewhere or
    # just directly to the DB for a limited amount of time before it is either
    # used and removed or auto removed


    # Creating mail to send
    msg = Message("Password Reset Request",
                  sender="photopro.jajac@gmail.com",
                  recipients=[email])
    msg.html = ("<div><p>Hi,</p>"
                f"<p>\nPlease enter this code to reset your PhotoPro password</p>"
                f"<p style='font-size: 32pt'>123456</p>"
                f"<p>Do not share this code with anyone. This code will remain valid for "
                "up to 10 minutes, if the code has expired you may repeat the process and a new code will be emailed to you.</p></div>")

    return msg

def password_reset_reset(reset_code, new_password):
    pass