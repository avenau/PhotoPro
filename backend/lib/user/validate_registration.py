"""
Validate inputs of the user
"""

import re
from lib.Error import EmailError, PasswordError, LocationError
from lib.countries_list import countries


def valid_registration(mongo, new_user):
    """
    Validate the registration
    @param mongo database
    @param new_user object
    """
    valid_email(mongo, new_user["email"])
    valid_name(new_user["fname"])
    valid_name(new_user["lname"])
    valid_pass(new_user["password"])
    valid_location(new_user["location"])


def valid_email(mongo, email):
    """
    Validate the email against a regex expression
    Used Pymongo method
    @param mongo database
    @param email: str
    return True on success
    """
    # Check if email is in valid format
    regex = r"^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.][\w.]+$"
    if not re.search(regex, email):
        raise EmailError("Invalid email")

    # Check if already registered
    if mongo.db.users.find({"email": email}).count() > 0:
        raise EmailError("Already registered with this email")


def valid_name(name):
    """
    Checks the name is valid by checking it's not empty
    @param name: str
    return True on success
    """
    if name is None:
        raise NameError("Cannot have no name")


def valid_pass(password):
    """
    Password validation
    @param password: string
    """
    if password is None:
        raise PasswordError("Empty password field")
    if len(password) < 8:
        raise PasswordError(
            "Password is too short. \
                             Must be more than 8 characters"
        )


def valid_location(location):
    """
    Checks that location is in the list of countries
    """
    if location not in countries:
        raise LocationError("Location not valid")
