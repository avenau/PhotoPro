'''
Mongoengine validation stuff
'''
import lib.Error as Error

def validate_likes(likes):
    '''
    Mongoengine validation of likes
    @param likes: str:[]
    '''
    unreasonable_number_of_likes = 999999
    if likes < 0:
        raise Error.ValidationError("Likes need to be more than 0")
    if likes > unreasonable_number_of_likes:
        raise Error.ValidationError("Cool your jets.")


def validate_credit(credit):
    '''
    Make sure user doesn't end up with negative credits
    '''
    if credit < 0:
        raise Error.ValidationError
