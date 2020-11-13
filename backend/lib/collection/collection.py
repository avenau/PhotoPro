'''
Collection related methods
'''

from mongoengine import BooleanField
from mongoengine import IntField

# Own class import
import lib.collection.validation as validation
import lib.catalogue.catalogue

import lib.Error as Error
from lib.collection.validation import validate_private

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
        tags: [string],
    }
    '''
    private = BooleanField(default=False, validation=validate_private)
    meta = {'collection': 'collections'}

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

    def get_collection_json(self):
        '''
        Get collection as a json string
        '''
        return {
            'title': self.get_title(),
            'photos': [this_photo.id for this_photo in self.get_photos()],
            'creation_date': str(self.get_creation_date()),
            'private': self.is_private(),
            'tags': self.get_tags(),
        }

    def clean(self):
        '''
        Methods to be performed on a self.save()
        1) Update the tags
        2) Update the price
        '''
        _user = self.created_by
        if Collection.objects(created_by=self.created_by, title=self.title, id__ne=self.id):
            raise Error.ValidationError("Cannot have two Collections with the same title")
