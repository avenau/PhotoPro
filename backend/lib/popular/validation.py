"""
Popular Photos Validation
"""
import mongoengine
import lib.Error as Error


def validate_likes(likes):
    """
    @param likes: int
    """
    try:
        mongoengine.IntField().validate(likes)
    except mongoengine.ValidationError:
        raise Error.ValidationError("Could not validate likes")
