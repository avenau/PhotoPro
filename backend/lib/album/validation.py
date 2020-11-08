'''
Album specific validation
'''
import traceback
import mongoengine
import lib.Error as Error

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
