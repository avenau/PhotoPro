"""
Validate photo details
TODO set new env variable for testing
"""

import json
from bson.objectid import ObjectId

from lib.Error import ValueError

def validate_album(albums):
    '''
    Check the album has a non-empty strings
    '''
    for i in albums:
        if i is None or i == "":
            raise ValueError("Cannot be empty or None")

    return True


def validate_extension(extension):
    '''
    Check that the extension is valid:
    .jpg, .jpeg, .png, .svg
    '''
    exts = [".jpg", ".jpeg", ".png", ".svg"]
    if extension not in exts:
        raise ValueError("Attempted to upload a file type we don't accept.")

    return True


def reformat_lists(photo_details):
    '''
    1) Lower case for tags
    2) Convert JSON album list to python
    '''
    photo_details = lower_tags(photo_details)
    photo_details = convert_album_list(photo_details)
    return photo_details


def lower_tags(photo_details):
    '''
    Convert tags to lowercase
    '''
    tags = photo_details["tags"]
    if not isinstance(tags, list):
        tags = json.loads(tags)

    photo_details.pop("tags")
    tags = [i.lower() for i in tags]
    photo_details.update({"tags": tags})
    return photo_details


def convert_album_list(photo_details):
    """
    Convert JSON album list to python
    """
    albums = photo_details["albums"]
    if not isinstance(albums, list):
        albums = json.loads(albums)
    photo_details["albums"] = albums
    return photo_details
