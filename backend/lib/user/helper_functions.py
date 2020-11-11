'''
User helper functions
'''

from lib.profile.upload_photo import update_user_thumbnail
from lib.Error import ValidationError, ValueError, UserDNE, TokenError
from jwt.exceptions import DecodeError, InvalidTokenError, InvalidSignatureError
import lib.token_functions as token_functions
import lib.user.user as user

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
    
def is_following(follower_id, followed_id):
    try:
        follower_user = user.User.objects.get(id=follower_id)
    except:
        return False
    
    followed_user = user.User.objects.get(id=followed_id)
    if not followed_user:
        raise UserDNE("User does not exist " + followed_id)
        
    return (followed_user in follower_user.following)
    
def update_follow(token, followed_id):
    try:
        user_id = token_functions.verify_token(token)["u_id"]
    except (InvalidSignatureError, DecodeError, TokenError, InvalidTokenError):
        raise UserDNE("You must be logged in to follow!")
    followed_user = user.User.objects.get(id=followed_id)
    if not followed_user:
        raise UserDNE("User does not exist " + followed_id)
        
    following_user = user.User.objects.get(id=user_id)
    if not following_user:
        raise UserDNE("User does not exist " + user_id)
    
    if (is_following(user_id, followed_id) == False):
        following_user.add_following(followed_user)
    else:
        following_user.remove_following(followed_user)
        
    following_user.save()
    
    
