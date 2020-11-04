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
import traceback
import mongoengine
from lib.Error import ValidationError, ValueError


def validate_price(price):
    '''
    Make sure price doesn't fall below zero
    '''
    print('in validate', price)

    # Use mongoengine's validation
    try:
        mongoengine.IntField().validate(price)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise ValidationError("Price field is not an integer")

    # Our own custom validation
    if price < 0:
        raise ValidationError("Price of photo cannot fall below zero")


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

def validate_extension(extension):
    '''
    Validate extension of the photo
    '''

    try:
        mongoengine.StringField().validate(extension)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise ValidationError("Extension is not valid")
    exts = [".jpg", ".jpeg", ".png", ".gif", ".svg"]
    if extension not in exts:
        raise ValueError("Unacceptable file type")

def validate_tags(tags):
    '''
    @param tags [string]
    '''
    try:
        mongoengine.ListField().validate(tags)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise ValidationError("Tag list is not valid")
    if len(tags) > 10:
        raise ValidationError("Cannot contain more than 10 tags")

    for tag in tags:
        try:
            mongoengine.StringField().validate(tag)
        except mongoengine.ValidationError:
            print(traceback.print_exc())
            raise ValidationError("String field for tag is not valid")
        if tag is None or len(tag) < 1:
            raise ValidationError("Tag cannot be an empty string")
        if len(tag) > 20:
            raise ValidationError("Tag cannot have more than 20 characters")

def validate_title(title):
    '''
    Check the title is not empty
    @param title: string
    '''
    try:
        mongoengine.StringField().validate(title)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise ValidationError("Title is not a valid string")
    if title is None or len(title) < 1 or len(title) > 40:
        raise ValueError("Title must be between 1 and 40 characters")

