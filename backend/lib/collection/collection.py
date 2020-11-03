'''
Collection related methods
'''

import datetime
from mongoengine import StringField
from mongoengine import ListField
from mongoengine import ReferenceField
from mongoengine import DateTimeField
from mongoengine import BooleanField
from mongoengine import IntField
from mongoengine import Document

# Own class import
import lib.photo.photo as photo
import lib.collection.validation as validation
import lib.catalogue.catalogue as catalogue


class Collection(catalogue.Catalogue):
    '''
    Collection class definition
    Collection {
        title: "Cool collection",
        photos: [Object1, Object2]
    }
    '''
    private = BooleanField(default=False)
    price = IntField(default=0, validation=validation.validate_price)
    meta = {'collection': 'collections-mongoengine'}


    def update_price(self):
        '''
        Iterate through the photos and update the price
        '''
        price = 0
        for this_photo in self.photos:
            price += this_photo.price
        self.price = price

    def set_private(self):
        '''
        Set the collection to private
        '''
        self.private = True

    def set_public(self):
        '''
        Set the collection to public
        '''
        self.private = False

    def delete_collection(self):
        '''
        Delete the collection
        '''
        super().delete_catalogue()

    def clean(self):
        '''
        Methods to be performed on a self.save()
        1) Update the tags
        2) Update the price
        '''
        super().clean()
        self.update_price()
