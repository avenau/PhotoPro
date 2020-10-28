"""
Backend file system API
Handle requests to read and write photos to file system
 - Team JAJAC :)
"""
import os

# Pip functions
import base64
from json import dumps
from flask import Flask, request, abort
from flask_cors import CORS
from functools import wraps

class Config(object):
    PORT_NUMBER = os.getenv("FS_API_PORT")
    TESTING = True
    FLASK_DEBUG = True

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
secretkey = "PhotoProSecretAPIKey"


def validate_secret(function):
    @wraps(function)
    def inner():
        if request.headers.get("secretkey") != secretkey:
            abort(401)
        return function()
    return inner

def dir_check(function):
    @wraps(function)
    def inner():
        if not os.path.exists("./backend/images"):
            os.makedirs("./backend/images")
        return function()
    return inner

@app.route('/upload', methods=['POST'])
@validate_secret
@dir_check
def upload_photo():
    """
    Description
    -----------
    Saves an image to the file system with the given title

    Parameters
    ----------
    title: str,
    price: str,
    token: str,
    tags: str[],
    albums: str[],
    photo: str,
    extension: str
    Returns
    -------
    None
    """
    photo_details = request.form.to_dict()
    # return dumps(create_photo_entry(mongo, photo_details))
    return dumps({})

@app.route('/get', methods=['POST'])
@validate_secret
@dir_check
def get_photo():
    """
    Description
    -----------
    Accepts parameters related to a photo, verifies the parameters,
    creates a database entry for the photo and saves the photo file
    to backend/images.

    Parameters
    ----------
    title: str,
    price: str,
    token: str,
    tags: str[],
    albums: str[],
    photo: str,
    extension: str
    Returns
    -------
    None
    """
    photo_details = request.form.to_dict()
    # return dumps(create_photo_entry(mongo, photo_details))
    return dumps({})


# '''
# ---------------
# - Test Routes -
# ---------------
# '''

@app.route('/testsecret', methods=['GET'])
@validate_secret
def test_secret():
    '''
    Testing decorator for validating token
    Use this decorator to verify the token is
    valid and matches the secret
    '''
    print("YAY")
    return dumps({
        "success": "success"
    })

@app.route('/testdir', methods=['GET'])
@dir_check
def test_dir():
    '''
    Testing decorator for ensuring images directory exists
    '''

    return dumps({
        "success": "success"
    })


@app.route('/', methods=['GET'])
def basic():
    """
    Basic Test route
    """
    arguments = {
            'first_name': 'test',
            'colour': 'test'
            }
    if request.args:
        arguments = request.args
    print(arguments)
    return dumps(arguments)

if __name__ == '__main__':
    app.run(port=8101, debug=True)