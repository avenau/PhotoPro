"""
Collection mongoengine.Document validation
"""
import traceback
import mongoengine
import lib.Error as Error


def validate_private(private):
    """
    @param private:boolean
    """
    try:
        mongoengine.BooleanField().validate(private)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise Error.ValidationError("Private field is not correct")
