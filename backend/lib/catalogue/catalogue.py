'''
Catalogue superclass
Subclassed to Collection and Album
'''

import datetime
from mongoengine import Document
from mongoengine import StringField
from mongoengine import ReferenceField
from mongoengine import ListField
from mongoengine import DateTimeField
from mongoengine import BooleanField

import lib.photo.photo as photo
import lib.user.user as user

class Catalogue(Document):
    '''
    Catalogue class
    '''
    title = StringField(required=True, max_length=200)
    photos = ListField(ReferenceField('photo.Photo'))
    creation_date = DateTimeField(default=datetime.datetime.now())
    created_by = ReferenceField('user.User')
    deleted = BooleanField(default=False)
    tags = ListField(StringField())
    meta = {'allow_inheritance': True}


    def get_title(self):
        '''
        Get the title of the collection
        '''
        return self.title

    def update_title(self, new_title):
        '''
        Update the title of the image
        '''
        self.title = new_title

    def get_tags(self):
        '''
        Get the list of tags
        '''
        return self.tags

    def update_tags(self):
        '''
        Create a unique set of all tags in all photos
        '''
        tags = set(self.tags)
        for this_photo in self.photos:
            for tag in this_photo.tags:
                tags.add(tag)
        self.tags = list(tags)

    def get_photos(self):
        '''
        Get the list of photos
        '''
        return self.photos

    def add_photo(self, new_photo):
        '''
        Add a single photo to the collection
        Adds this collection to the photo
        '''
        self.photos.append(new_photo)
        new_photo.add_collection(self)

    def add_photos(self, new_photos):
        '''
        Add a list of photos
        Add this collection to the photos
        @param photos: list of photo references
        '''
        for this_photo in new_photos:
            self.photos.append(this_photo)
            this_photo.add_collection(self)

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

    def remove_photos(self, photos):
        '''
        Remove a list of photos from this collection
        Remove this collection from the list of photos
        @param photos: list of photo references
        '''
        for this_photo in photos:
            self.remove_photo(this_photo)


    def is_deleted(self):
        '''
        Check whether the collection is deleted
        '''
        return self.deleted


    def delete_catalogue(self):
        '''
        Soft deletion of the collection
        Dereferences photos and removes self
        '''
        self.deleted = True
        for this_photo in self.photos:
            this_photo.remove_collection(self)
            this_photo.save()

    def clean(self):
        self.update_tags()
