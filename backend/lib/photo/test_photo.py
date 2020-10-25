import pytest
from validate_photo import *
from ..Error import ValueError


def photo():
    return {
        "title": 'Example photo',
        "price": "15",
        "tags": ["apple", "fruit", "nature", "adventure"],
        "albumsToAddTo": ["fruit", "nature"]
    }

# ========================== Test upload ==========================
def test_title():
    photoDetails = photo()
    with pytest.raises(ValueError):
        validate_title("")

    with pytest.raises(ValueError):
        validate_title(None)

    with pytest.raises(ValueError):
        validate_title("According to all known laws of aviation,\
                        there is no way a bee, should be able to fly.")

    assert validate_title(photoDetails["title"]) is True


def test_price():
    photoDetails = photo()
    with pytest.raises(ValueError):
        validate_price("hello15")

    with pytest.raises(ValueError):
        validate_price("")

    with pytest.raises(ValueError):
        validate_price("-10")

    assert validate_price(photoDetails["price"]) is True
    assert validate_price(16) is True


def test_tags():
    photoDetails = photo()

    # Maximum of 10 tags
    with pytest.raises(ValueError):
        validate_tags(["apple", "fruit", "nature", "adventure",
                       "a", "b", "c", "d", "e", "f", "g"])

    with pytest.raises(ValueError):
        validate_tags(["appleappleappleappleappleappleappleapple"])

    # No empty tags
    with pytest.raises(ValueError):
        validate_tags(["", "apple"])

    assert validate_tags(photoDetails["tags"]) == True

def test_albums():
    photoDetails = photo()
    # No empty albums
    with pytest.raises(ValueError):
        validate_album(["", "album1"])

    assert validate_album(photoDetails["albumsToAddTo"]) is True


def test_lower():
    testdict = {"tags": ["UPPER", "lower", "mIx"]}
    testdict = lower_tags(testdict)
    assert testdict == {'tags': ['upper', 'lower', 'mix']}
