'''
Mongoengine validation stuff
'''
import lib.Error as Error
import mongoengine


def validate_likes(likes):
    '''
    Mongoengine validation of likes
    @param likes: str:[]
    '''
    mongoengine.IntField().validate(likes)
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


def validate_extension(extension):
    '''
    Validate extension of the user photo
    '''
    mongoengine.StringField().validate(extension)
    exts = [".jpg", ".jpeg", ".png", ".gif", ".svg"]
    if extension not in exts:
        raise Error.ValueError("Unacceptable file type")
