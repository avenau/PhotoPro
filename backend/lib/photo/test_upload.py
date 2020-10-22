import pytest
from upload_photo import *
from validate_photo_details import *

photo_details = {
        "title": 'Example photo',
        "price": "15",
        "tags": ["apple", "fruit", "nature", "adventure"],
        "albumsToAddTo": ["fruit", "nature"]
    }

# ========================== Tests ==========================
def test_title():
    with pytest.raises(ValueError):
        validate_title("")

    with pytest.raises(ValueError):
        validate_title(None)

    assert validate_title(photoDetails["title"]) == True

def test_price():
    with pytest.raises(ValueError):
        validate_price("hello15")

    with pytest.raises(ValueError):
        validate_price("")

    assert validate_price(photo_details["price"]) == True
    assert validate_price(16) == True

def test_tags():
    # Maximum of 10 tags
    with pytest.raises(ValueError):
        validate_tags(["apple", "fruit", "nature", "adventure", "a", "b", "c", "d", "e", "f", "g"])

    # No empty tags
    with pytest.raises(ValueError):
        validate_tags(["", "apple"])

    assert validate_tags(photo_details["tags"]) == True

def test_albums():
    # No empty albums
    with pytest.raises(ValueError):
        validate_album(["", "album1"])

    assert validate_album(photo_details["tags"]) == True
