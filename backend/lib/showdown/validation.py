"""
Mongoengine validation stuff
"""
import lib.Error as Error
import mongoengine
import traceback


def validate_participating(participants):
    """
    Mongoengine validation of likes
    @param likes: str:[]
    """

    try:
        mongoengine.ListField().validate(participants)
    except:
        print(traceback.format_exc())
        raise Error.ValidationError("Validation error of participants list")

    if len(participants) > 2:
        raise Error.ValidationError(
            "There cannot be more than two participants in a showdown"
        )
