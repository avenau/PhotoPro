"""
Validate photo details
"""
from lib.Error import ValueError
import json
def validate_photo(details):
    validate_price(details["price"])
    validate_title(details["title"])
    validate_album(details["albumsToAddTo"])
    validate_tags(details["tagsList"])

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
        if price == None:
            raise ValueError("Empty object")
        price = int(price)
    if type(price) is int:
        if price < 0:
            raise ValueError("Price cannot be negative")
    return True

def validate_tags(tags):
    """
    Check 10 or fewer tags
    @param tags: list[str]
    @return True or error
    """
    # Convert to python dictionary
    tags = json.loads(tags)
    if len(tags) > 10:
        raise ValueError("Cannot contain more than 10 tags")

    for i in tags:
        if i is None or len(i) < 1 or len(i) > 20:
            raise ValueError("Tag must be between 1 and 20 characters")

    return True

def validate_title(title):
    """
    Check title is not empty
    @param title: str
    @return True or error
    """
    if title is None or len(title) < 1 or len(title) > 40:
        raise ValueError("Title must be between 1 and 40 characters")

    return True

def validate_album(albums):
    # Convert to python dictionary
    albums = json.loads(albums)
    print(albums)
    print(len(albums))
    for i in albums:
        if i is None or i == "":
            raise ValueError("Cannot be empty or None")

    return True