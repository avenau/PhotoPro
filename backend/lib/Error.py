"""
Error Handling Methods
Access Error: Error when user cannot access an item
ValueError: Error with the content given
"""

from werkzeug.exceptions import HTTPException


class AccessError(HTTPException):
    """
    AccessError: Error when user cannot access an item
    """

    code = 400
    message = "No message specified"
    toast = True


class UserDNE(HTTPException):
    """
    UserDNE: Error when user does not exist
    """

    code = 400
    message = "No message specified"
    toast = False


class PhotoDNE(HTTPException):
    """
    PhotoDNE: Error when photo does not exist
    """

    code = 400
    message = "No message specified"
    toast = False


class ValueError(HTTPException):
    """
    ValueError: Error with the content given
    """

    code = 400
    message = "No message specified"
    toast = True


class EmailError(HTTPException):
    """
    EmailError: Error with the email given
    """

    code = 400
    message = "No message specified"
    toast = True


class PasswordError(HTTPException):
    """
    PasswordError: Error with the email given
    """

    code = 400
    message = "No message specified"
    toast = True


class LocationError(HTTPException):
    """
    PasswordError: Error with the email given
    """

    code = 400
    message = "No message specified"
    toast = True


class TokenError(HTTPException):
    """
    TokenError: When something went wrong with the Token
    """

    code = 500
    message = "No message specified"
    toast = True


class DatabaseError(HTTPException):
    """
    DatabaseError: When something unexpected happens in the database
    """

    code = 500
    message = "No message specified"
    toast = True


class ValidationError(HTTPException):
    """
    ValidationError: When mongoengine can't validate the changes
    """

    code = 406
    message = "Validation on Database failed. Input error"
    toast = True
