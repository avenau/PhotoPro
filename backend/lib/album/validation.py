'''
Album specific validation
'''
import traceback
from mongoengine import IntField

import lib.Error as Error

def validate_discount(discount):
    '''
    Essentially the same as photo.validation.validate_price
    '''
    IntField().validation(discount)
    if discount < 0:
        print(traceback.format_exc())
        raise Error.ValidationError("Discount cannot be below 0")

    if discount > 100:
        print(traceback.format_exc())
        raise Error.ValidationError("Discount cannot be greater than 100")
