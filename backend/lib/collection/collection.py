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


class Collection(Document):
    '''
    Collection class definition
    Collection {
        title: "Cool collection",
        photos: [Object1, Object2]
    }
    '''
    title = StringField(required=True, max_length=200)
    photos = ListField(ReferenceField('photo.Photo'))
    creation_date = DateTimeField(default=datetime.datetime.now())
    # created_by = ReferenceField(User)
    private = BooleanField(default=False, required=True)
    tags = ListField(StringField())
    price = IntField(default=0)
    meta = {'collection': 'collections-mongoengine'}

    def update_title(self, new_title):
        '''
        Update the title of the image
        '''
        self.title = new_title
        self.save()

    def update_tags(self):
        '''
        Create a unique set of all tags in all photos
        '''
        tags = set(self.tags)
        for this_photo in self.photos:
            for tag in this_photo.tags:
                tags.add(tag)
        self.tags = list(tags)
        self.save()

    def add_photo(self, new_photo):
        '''
        Add a single photo
        '''
        self.photos.append(new_photo)
        self.update_tags()
        self.update_price()
        self.save()

    def add_photos(self, new_photos):
        '''
        Add a list of photos
        @param photos: list of photo references
        '''
        for this_photo in new_photos:
            self.photos.append(this_photo)
        self.update_tags()
        self.update_price()
        self.save()

    def remove_photos(self, photos):
        '''
        Remove a list of photos
        @param photos: list of photo references
        '''
        for this_photo in photos:
            self.photos.remove(this_photo)
        self.update_tags()
        self.update_price()
        self.save()

    def update_price(self):
        '''
        Iterate through the photos and update the price
        '''
        price = 0
        for this_photo in self.photos:
            price += this_photo.price
        self.price = price
        self.save()

    def set_private(self):
        '''
        Set the collection to private
        '''
        self.private = True
        self.save()

    def set_public(self):
        '''
        Set the collection to public
        '''
        self.private = False
        self.save()
