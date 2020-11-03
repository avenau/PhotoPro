'''
Album specific validation
'''
import traceback
from mongoengine import IntField

import lib.Error as Error

def validate_price(price):
    '''
    Essentially the same as photo.validation.validate_price
    '''
    IntField().validation(price)
    if price < 0:
        print(traceback.format_exc())
        raise Error.ValidationError("Price cannot be below 0")
