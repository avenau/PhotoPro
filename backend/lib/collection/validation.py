'''
Collection mongoengine.Document validation
'''
import traceback
import mongoengine
from lib.Error import ValidationError


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
