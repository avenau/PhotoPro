'''
Validate inputs of the user
'''
from Error import EmailError
from Error import PasswordError
import re

def valid_email(mongo, email):
    # Check if email is in valid format
    regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
    if !re.search(regex, email):
        raise EmailError('Invalid email')

    # Check if already registered
    if mongo.user.find({'email': email}).count > 0:
        raise EmailError('Already registered with this email')
    
    return True

def valid_name(name):
    if name is None:
        raise NameError('Cannot have no name')

def valid_pass(password):
    if password is None:
        raise PasswordError('Empty password field')
    if len(password) < 8:
        raise PasswordError('Password is too short. Must be more than 8 characters')
    return True
        