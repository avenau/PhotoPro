'''
Collection related methods
'''

from mongoengine import BooleanField
from mongoengine import IntField

# Own class import
import lib.collection.validation as validation
import lib.catalogue.catalogue


class Collection(lib.catalogue.catalogue.Catalogue):
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

    def remove_photo(self, old_photo):
        '''
        Remove a photo from this collection
        Remove this collection from the photo
        @param photo: Photo(Document)
        '''
        if self in old_photo.collections:
            old_photo.collections.remove(self)
            old_photo.save()
        
        if old_photo in self.photos:
            self.photos.remove(old_photo)
            self.save()

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
