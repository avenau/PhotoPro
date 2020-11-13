"""
Mongoengine validation stuff
"""
import lib.Error as Error
import mongoengine
import traceback


def validate_participants(participants):
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

def validate_start_date(start_date):
    '''
    @param: start_date: DateTime
    '''
    try:
        mongoengine.DateTimeField().validate(start_date)
    except:
        print(traceback.format_exc())
        raise Error.ValidationError("Start Date validation failed")

def validate_duration(duration):
    '''
    @param duration: int
    '''
    try:
        mongoengine.IntField().validate(duration)
    except:
        print(traceback.format_exc())
        raise Error.ValidationError("Duration validation failed")
    
