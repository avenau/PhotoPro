"""
Configure flask app settings using config pattern
- https://flask.palletsprojects.com/en/1.1.x/config
"""
import os
from json import dumps

# Mongo setup, connect to the db
local_db = "mongodb://localhost:27017/angular-flask-muckaround"
remote_db = "mongodb://jajac:databasepassword@jaczel.com:27017/angular-flask-muckaround?authSource=admin"


class Config(object):
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = "photopro.jajac@gmail.com"
    MAIL_PASSWORD = "photoprodemopassword"
    PORT_NUMBER = os.getenv("BACKEND_PORT")
    SHOWDOWN_LENGTH = os.getenv("SHOWDOWN_LENGTH")
    MAIL_SUPPRESS_SEND = False


class DevelopmentConfig(Config):
    MONGO_URI = local_db
    TESTING = True
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    MONGO_URI = remote_db


def defaultHandler(err):
    """
    Description
    -----------
    Error Handler to pass messages to frontend

    Parameters
    ----------
    Error object

    Returns
    -------
    JSON response
    """
    response = err.get_response()
    response.data = dumps(
        {
            "code": err.code,
            "name": "System Error",
            "message": err.description,
            "show_toast": err.toast,
        }
    )
    response.content_type = "application/json"
    return response
