"""
Token related decorators
"""
from functools import wraps
import jwt
from flask import request
from lib.token_functions import secret
from lib.Error import TokenError
from jwt.exceptions import DecodeError
from jwt.exceptions import InvalidTokenError
from jwt.exceptions import InvalidSignatureError


def validate_token(function):
    """
    Description
    -----------
    Decorator to check that the token is valid

    Parameters
    ----------
    request.args

    Returns
    -------
    None

    Errors
    ------
    Raises appropriate errors on decode problems

    """

    @wraps(function)
    def validate(*args, **kwargs):

        # Check for HTTP method
        if request.method == "GET":
            token = request.args.get("token")
        elif request.method == "POST":
            token = request.form["token"]
        elif request.method == "DELETE":
            try:
                token = request.args.get("token")
            except:
                token = request.form.to_dict()["token"]

        elif request.method == "PUT":
            token = request.form["token"]
        else:
            print("@validate_token supports GET, PUT, POST and DELETE requests")
            raise TokenError(
                "@validate_token supports GET\
                              , POST, DELETE requests"
            )

        # Check that token is correct format
        if isinstance(token, str) is False:
            print("Token is not a string")
            raise TokenError("Please log in to use this feature.")
        if token == "":
            print("Token is an empty string")
            raise TokenError("Please log in to use this feature.")

        # Try decoding
        try:
            jwt.decode(token, secret)
        except InvalidSignatureError:
            print("Invalid signature" + secret)
            raise TokenError("Invalid secret")
        except DecodeError:
            print("Token failed validation")
            raise TokenError("We couldn't find what you're looking for :( ")
        except InvalidTokenError:
            print("Token failed validation")
            raise TokenError("We couldn't find what you're looking for :( ")

        return function(*args, **kwargs)

    return validate
