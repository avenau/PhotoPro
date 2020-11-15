"""
Error Handling Methods
Access Error: Error when user cannot access an item
ValueError: Error with the content given
"""

from werkzeug.exceptions import HTTPException

class CustomError(HTTPException):
    """
    Base class
    """

class AccessError(CustomError):
    """
    AccessError: Error when user cannot access an item
    """

    code = 400
    message = "No message specified"
    toast = True


class UserDNE(CustomError):
    """
    UserDNE: Error when user does not exist
    """

    code = 400
    message = "No message specified"
    toast = False


class PhotoDNE(CustomError):
    """
    PhotoDNE: Error when photo does not exist
    """

    code = 400
    message = "No message specified"
    toast = True


class ValueError(CustomError):
    """
    ValueError: Error with the content given
    """

    code = 400
    message = "No message specified"
    toast = True


class EmailError(CustomError):
    """
    EmailError: Error with the email given
    """

    code = 400
    message = "No message specified"
    toast = True


class PasswordError(CustomError):
    """
    PasswordError: Error with the email given
    """

    code = 400
    message = "No message specified"
    toast = True


class LocationError(CustomError):
    """
    PasswordError: Error with the email given
    """

    code = 400
    message = "No message specified"
    toast = True


class TokenError(CustomError):
    """
    TokenError: When something went wrong with the Token
    """

    code = 500
    message = "No message specified"
    toast = True


class DatabaseError(CustomError):
    """
    DatabaseError: When something unexpected happens in the database
    """

    code = 500
    message = "No message specified"
    toast = True


class ValidationError(CustomError):
    """
    ValidationError: When mongoengine can't validate the changes
    """

    code = 406
    message = "Validation on Database failed. Input error"
    toast = True
