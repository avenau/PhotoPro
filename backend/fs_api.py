"""
Backend file system API
Handle requests to read and write photos to file system
 - Team JAJAC :)
"""
import os

# Pip functions
import base64
from json import dumps
from flask import Flask, request, abort, send_from_directory
from flask.helpers import send_file
from flask_cors import CORS
from functools import wraps

class Config(object):
    PORT_NUMBER = os.getenv("FS_API_PORT")
    TESTING = True
    DEBUG = True

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
secretkey = "PhotoProSecretAPIKey"

"""
HELPERS
"""

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

"""
ROUTES
"""

# TODO complete
@app.route('/upload', methods=['POST'])
@validate_secret
@dir_check
def upload_photo():
    """
    Description
    -----------
    Saves an image to the file system with the given filename

    Parameters
    ----------
    filename: str,
    photo: str

    Returns
    -------
    None
    """
    photo_details = request.form.to_dict()
    # return dumps(create_photo_entry(mongo, photo_details))
    return dumps({})

# TODO get actual photo not static
@app.route('/get', methods=['GET'])
@validate_secret
@dir_check
def get_photo():
    """
    Description
    -----------
    Get base64 string of a photo from a file system

    Parameters
    ----------
    filename: str

    Returns
    -------
    photoStr: str
    """
    photo_details = request.form.to_dict()
    with open("./backend/images/5f98e3a13308e8ba864b0524.jpg", "rb") as f:
        img = f.read()
        return base64.b64encode(img).decode("utf-8")

    # If using blob instead of base64 encode
    # return send_from_directory(directory="./images", filename="5f98e3a13308e8ba864b0524.jpg", as_attachment=True, attachment_filename="test.jpg")

'''
---------------
- Test Routes -
---------------
'''

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
@validate_secret
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