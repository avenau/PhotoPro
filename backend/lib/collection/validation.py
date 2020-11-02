'''
Collection mongoengine.Document validation
'''
import mongoengine
from lib.Error import ValidationError

def validate_price(price):
    '''
    Make sure the price doesn't fall below zero
    '''
    mongoengine.IntField().validate(price)
    if price < 0:
        raise ValidationError("Price went below zero")
