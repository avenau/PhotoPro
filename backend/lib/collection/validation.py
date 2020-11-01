'''
Collection mongoengine.Document validation
'''
from lib.Error import ValidationError

def validate_price(price):
    '''
    Make sure the price doesn't fall below zero
    '''
    if price < 0:
        raise ValidationError("Price went below zero")
