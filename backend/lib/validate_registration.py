'''
Validate inputs of the user
'''
from lib.Error import EmailError, PasswordError, LocationError
import re
from lib.countries_list import countries

def valid_registration(mongo, new_user):
    valid_email(mongo, new_user["email"])
    valid_name(new_user["fname"])
    valid_name(new_user["lname"])
    valid_pass(new_user["password"])
    valid_location(new_user["location"])

def valid_email(mongo, email):
    # Check if email is in valid format
    regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.][\w.]+$'
    if not re.search(regex, email):
        raise EmailError('Invalid email')

    # Check if already registered
    if mongo.db.users.find({'email': email}).count() > 0:
        raise EmailError('Already registered with this email')

    return True

def valid_name(name):
    if name is None:
        raise NameError('Cannot have no name')
    return True

def valid_pass(password):
    if password is None:
        raise PasswordError('Empty password field')
    if len(password) < 8:
        raise PasswordError('Password is too short. Must be more than 8 characters')
    return True


def valid_location(location):
    if location not in countries:
        raise LocationError('Location not valid')

    return True
