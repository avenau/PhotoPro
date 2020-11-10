'''
User helper functions
'''

from lib.profile.upload_photo import update_user_thumbnail
from lib.Error import ValidationError, ValueError

def update_value(bcrypt, user, key, value):
    '''
    Update the key/value pair in the database
    mongoengine reimplementation
    Update this list as necessary
    '''

    if key == 'fname':
        user.set_fname(value)
    elif key == 'lname':
        user.set_lname(value)
    elif key == 'email':
        try:
            user.set_email(value)
            user.save()
        except:
            raise ValueError("An account is already registered with this email.")

    elif key == 'nickname':
        user.set_nickname(value)
    elif key == "password":
        hashed_password = bcrypt.generate_password_hash(value)
        user.set_password(hashed_password)
    elif key == 'aboutMe':
        user.set_about_me(value)
    elif key == 'location':
        user.set_location(value)
    elif key == 'profilePic':
        user.set_profile_pic(value)

    user.save()
