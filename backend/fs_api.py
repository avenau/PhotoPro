"""
Backend file system API
Handle requests to read and write photos to file system
 - Team JAJAC :)
"""
import os

# Pip functions
import base64
import zipfile
from json import dumps
from io import BytesIO
from flask import Flask, request, abort, send_from_directory
from flask.helpers import send_file
from flask_cors import CORS
from functools import wraps


class Config(object):
    PORT_NUMBER = os.getenv("FS_API_PORT")


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


@app.route("/save", methods=["POST"])
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
    r = request.form.to_dict()
    with open(f"./backend/images/{r['filename']}", "wb") as f:
        f.write(base64.b64decode(r["photo"]))
    return dumps({})


# TODO get actual photo not static
@app.route("/get", methods=["GET"])
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
    r = request.args.to_dict()
    print(r)
    try:
        with open(f"./backend/images/{r['filename']}", "rb") as f:
            img = f.read()
            return base64.b64encode(img).decode("utf-8")
    except:
        abort(404)


@app.route("/download", methods=["GET"])
@validate_secret
@dir_check
def get_iamges():
    """
    Description
    -----------
    Get the images/ directory as a zip

    Parameters
    ----------

    Returns
    -------
    images: zip file
    """
    r = request.args.to_dict()
    print(r)
    try:
        memory_file = BytesIO()
        with zipfile.ZipFile(memory_file, "w") as zf:
            for individualFile in os.listdir(path="./backend/images"):
                zf.write(
                    f"./backend/images/{individualFile}", arcname=f"{individualFile}"
                )
        memory_file.seek(0)
        return send_file(
            memory_file, attachment_filename="images.zip", as_attachment=True
        )
    except Exception as e:
        print(e)
        abort(404)


"""
---------------
- Test Routes -
---------------
"""


@app.route("/testsecret", methods=["GET"])
@validate_secret
def test_secret():
    """
    Testing decorator for validating token
    Use this decorator to verify the token is
    valid and matches the secret
    """
    print("YAY")
    return dumps({"success": "success"})


@app.route("/testdir", methods=["GET"])
@validate_secret
@dir_check
def test_dir():
    """
    Testing decorator for ensuring images directory exists
    """

    return dumps({"success": "success"})


@app.route("/", methods=["GET"])
def basic():
    """
    Basic Test route
    """
    arguments = {"first_name": "test", "colour": "test"}
    if request.args:
        arguments = request.args
    return dumps(arguments)


if __name__ == "__main__":
    app.run(port=8101, debug=False)
