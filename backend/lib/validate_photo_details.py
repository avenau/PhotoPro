"""
Validate photo details
TODO set new env variable for testing
"""
from lib.Error import ValueError
import json


def validate_photo(details):
    validate_price(details["price"])
    validate_title(details["title"])
    validate_extension(details["extension"])
    validate_album(details["albums"])
    validate_tags(details["tags"])


def validate_price(price):
    """
    @param price: int
    @return True or error
    """
    if type(price) is str:
        if not price.isnumeric():
            raise ValueError("Cannot contain alphabet characters")
        if price == "":
            raise ValueError("Price cannot be empty")
        if price is None:
            raise ValueError("Empty object")
        price = int(price)
    if type(price) is int:
        if price < 0:
            raise ValueError("Price cannot be negative")
    return True


def validate_tags(tags):
    """
    Check 10 or fewer tags
    @param tags: json str
    @return True or error
    """

    if len(tags) > 10:
        raise ValueError("Cannot contain more than 10 tags")

    for i in tags:
        if i is None or len(i) < 1 or len(i) > 20:
            raise ValueError("Tag must be between 1 and 20 characters")

    return True

def validate_title(title):
    """
    Check title is not empty
    @param title: json str
    @return True or error
    """
    if title is None or len(title) < 1 or len(title) > 40:
        raise ValueError("Title must be between 1 and 40 characters")

    return True


def validate_album(albums):
    for i in albums:
        if i is None or i == "":
            raise ValueError("Cannot be empty or None")

    return True


def validate_extension(extension):
    # Accepted extensions
    exts = [".jpg", ".jpeg", ".png", ".gif", ".svg"]
    if extension not in exts:
        raise ValueError("You attempted to upload a file type we don't accept.")

    return True


def reformat_lists(photo_details):
    photo_details = lower_tags(photo_details)
    photo_details = convert_album_list(photo_details)

    return photo_details


def lower_tags(photo_details):
    tags = photo_details["tags"]
    if type(tags) is not list:
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
    if type(albums) is not list:
        albums = json.loads(albums)
    photo_details["albums"] = albums
    return photo_details
