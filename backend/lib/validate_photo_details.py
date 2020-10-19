"""
Validate photo details
"""
from lib.Error import ValueError
def validate_photo(details):
    validate_price(details["price"])
    validate_title(details["title"])

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

    return True

def validate_tags(tags):
    """
    Check 10 or fewer tags
    @param tags: list[str]
    @return True or error
    """
    if type(tags) != list:
        raise ValueError("Expecting list of tags")
    else:
        if len(tags) > 10:
            raise ValueError("Cannot contain more than 10 tags")

        for i in tags:
            if i is None or i == "":
                raise ValueError("Cannot be empty or None")

    return True

def validate_title(title):
    """
    Check title is not empty
    @param title: str
    @return True or error
    """
    if title is None or title == "":
        raise ValueError("Cannot be empty or None")

    return True

def validate_album(album):
    for i in album:
        if i is None or i == "":
            raise ValueError("Cannot be empty or None")

    return True