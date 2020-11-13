'''
Collection mongoengine.Document validation
'''
import traceback
import mongoengine
import lib.Error as Error


def validate_private(private):
    '''
    @param private:boolean
    '''
    try:
        mongoengine.BooleanField().validate(private)
    except mongoengine.ValidationError:
        raise Error.ValidationError("Private field is not correct")
