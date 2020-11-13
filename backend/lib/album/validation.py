"""
Album specific validation
"""
import traceback
import mongoengine
import lib.Error as Error
from lib.Error import ValidationError


def validate_discount(discount):
    """
    Essentially the same as photo.validation.validate_price
    """
    try:
        mongoengine.IntField().validate(discount)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Value is not an integer")

    if int(discount) < 0:
        print(traceback.format_exc())
        raise Error.ValidationError("Discount cannot be below 0")

    if int(discount) > 100:
        print(traceback.format_exc())
        raise Error.ValidationError("Discount cannot be greater than 100")
