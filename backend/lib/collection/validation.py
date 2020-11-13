'''
Collection mongoengine.Document validation
'''
import traceback
import mongoengine
from lib.Error import ValidationError, ValueError


def validate_price(price):
    '''
    Make sure the price doesn't fall below zero
    '''
    mongoengine.IntField().validate(price)
    if price < 0:
        raise ValidationError("Price went below zero")


def validate_discount(discount):
    '''
    Validate the discount changes
    '''
    try:
        mongoengine.IntField().validate(discount)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise ValidationError("Discount is not a valid integer")
    if discount < 0:
        raise ValidationError("Discount must be greater than 0")
    if discount > 100:
        raise ValidationError("Discount must be less than 100")

def validate_title(title, user, cur_collectionid):
    """
    Check if the user can make an album with a given title.
    Duplicate album/collection names for a user are not 
    
    @param title str
    @param user mongo obj
    """
    
    if len(title) > 40:
        raise ValueError("Please enter a title which is less than 40 characters")

    collections = user.get_collections()
    
    for collection in collections:
        if cur_collectionid != collection.get_id():
            if title == collection.get_title():
                raise ValidationError("Please enter a unique collection title")
        
    return True
