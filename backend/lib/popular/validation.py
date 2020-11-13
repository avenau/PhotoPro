'''
Popular Photos Validation
'''
import mongoengine
import lib.Error as Error

def validate_likes(likes):
    '''
    @param likes: int
    '''
    try:
        mongoengine.IntField().validate(likes)
    except mongoengine.ValidationError:
        raise Error.ValidationError("Could not validate likes")
    if likes < 0:
        raise Error.ValidationError("Likes cannot be less than 0")
