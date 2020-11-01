'''
Photo mongoengine.Document custom validation
Note that mongoengine provides basic validation
    such as type checking. Add additonal validation
    here and add it to the Document definition as
    a parameter

    e.g.
    Class Photo(Document):
        title = StringField(validation=validation.validate_title)
'''
from lib.Error import ValidationError


def validate_price(price):
    '''
    Make sure price doesn't fall below zero
    '''
    if price < 0:
        raise ValidationError("Price of photo cannot fall below zero")


def validate_discount(discount):
    '''
    Validate the discount changes
    '''
    if not isinstance(discount, int):
        raise ValidationError("Discount must be of type integer")
    if discount < 0:
        raise ValidationError("Discount must be greater than 0")
    if discount > 100:
        raise ValidationError("Discount must be less than 100")
