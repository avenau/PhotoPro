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
    Sub class of Catalogue
    Collection {
        title: string,
        photos: [Photo],
        creation_date: datetime,
        deleted: boolean,
        private: boolean,
        price, int
        tags: [string],
    }
    '''
    private = BooleanField(default=False)
    price = IntField(default=0, validation=validation.validate_price)
    meta = {'collection': 'collections-mongoengine'}

    def get_price(self):
        '''
        Get the price of the collection
        '''
        return self.price

    def update_price(self):
        '''
        Iterate through the photos and update the price
        '''
        price = 0
        for this_photo in self.photos:
            price += this_photo.price
        self.price = price

    def is_private(self):
        '''
        Get whether the Collection is private
        '''
        return self.private

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

    def get_collection_json(self):
        '''
        Get collection as a json string
        '''
        return {
            'title': self.get_title(),
            'photos': [this_photo.id for this_photo in self.get_photos()],
            'creation_date': self.get_creation_date(),
            'deleted': self.is_deleted(),
            'private': self.is_private(),
            'price': self.get_price(),
            'tags': self.get_tags(),
        }

    def clean(self):
        '''
        Methods to be performed on a self.save()
        1) Update the tags
        2) Update the price
        '''
        super().clean()
        self.update_price()
