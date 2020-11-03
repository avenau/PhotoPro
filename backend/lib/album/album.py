'''
Album class.
TODO: Flesh it out
'''
from mongoengine import IntField
import lib.catalogue.catalogue as catalogue
import lib.album.validation as validation

class Album(catalogue.Catalogue):
    '''
    Albums have a price
    '''
    price = IntField(default=0,
                     validation=validation.validate_price)

    def get_price(self):
        '''
        Get the price of an album
        '''
        return self.price

    def set_price(self, price):
        '''
        Set the price of the album
        '''
        self.price = price
