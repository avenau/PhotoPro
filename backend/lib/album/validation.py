'''
Album specific validation
'''
import traceback
import mongoengine
import lib.Error as Error
from lib.Error import ValueError, ValidationError

def validate_discount(discount):
    '''
    Essentially the same as photo.validation.validate_price
    '''
    mongoengine.IntField().validate(discount)
    if int(discount) < 0:
        print(traceback.format_exc())
        raise Error.ValidationError("Discount cannot be below 0")

    if int(discount) > 100:
        print(traceback.format_exc())
        raise Error.ValidationError("Discount cannot be greater than 100")

def validate_title(title, user):
    """
    Check if the user can make an album with a given title.
    Duplicate album/collection names for a user are not 
    
    @param title str
    @param user mongo obj
    """
    
    if len(title) > 40:
        raise ValueError("Please enter a title which is less than 40 characters")

    albums = user.get_albums()
    
    for album in albums:
        if title == album.get_title():
            raise ValidationError("Please enter a unique album title")
    
    return True
        