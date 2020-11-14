"""
Catalogue superclass
Subclassed to Collection and Album
"""

import datetime
from mongoengine import Document
from mongoengine import StringField
from mongoengine import ReferenceField
from mongoengine import ListField
from mongoengine import DateTimeField
from mongoengine import BooleanField

import lib.photo.photo as photo
import lib.user.user as user
import lib.catalogue.validation as validation


class Catalogue(Document):
    """
    Catalogue class
    """

    title = StringField(
        required=True, max_length=40, validation=validation.validate_title
    )
    photos = ListField(
        ReferenceField("photo.Photo"), validation=validation.validate_photos
    )
    creation_date = DateTimeField(
        required=True, validation=validation.validate_creation_date
    )
    created_by = ReferenceField(
        "user.User", validation=validation.validate_created_by, required=True
    )
    tags = ListField(StringField(), validation=validation.validate_tags)
    meta = {"allow_inheritance": True, "abstract": True}

    def get_id(self):
        """
        Object id of the catalogue object
        return: id: str
        """
        return self.id

    def get_title(self):
        """
        Get the title of the collection
        return: title: str
        """
        return self.title

    def update_title(self, new_title):
        """
        Update the title of the image
        @param: new_title: str
        """
        self.title = new_title

    def get_tags(self):
        """
        Get the list of tags
        @return: [tag:str]
        """
        return self.tags

    def add_tags(self, tags):
        """
        Add tags to the list
        @param: [tag: str]
        """
        self.tags = self.tags + tags
        # Ensure unique
        self.update_tags()

    def set_tags(self, tags):
        """
        Delete old tags and set to these tags
        @param: [tag: str]
        """
        self.tags = tags
        self.update_tags()

    def update_tags(self):
        """
        Create a unique set of tags for the collection
        """
        tags = set(self.tags)
        self.tags = list(tags)

    def get_photos(self):
        """
        Get the list of photos
        return: [Document.Photo]
        """
        photos = []
        for this_photo in self.photos:
            if not this_photo.is_deleted():
                photos.append(this_photo)
        return photos

    def add_photo(self, new_photo):
        """
        Add a single photo to the collection by default.
        Adds this collection to the photo
        @param: Document.Photo
        """
        if new_photo not in self.photos:
            self.photos.append(new_photo)
            # new_photo.add_collection(self)

    def add_photos(self, new_photos):
        """
        Add a list of photos
        Add this collection to the photos
        @param: [Document.Photo]
        """
        for this_photo in new_photos:
            self.add_photo(this_photo)

    def remove_photos(self, photos):
        """
        Remove a list of photos from this collection
        Remove this collection from the list of photos
        @param: [Document.Photo]
        """
        for this_photo in photos:
            self.photos.remove(this_photo)

    def get_creation_date(self):
        """
        Get when the Catalogue was made
        return: creation_date: Date
        """
        return self.creation_date

    def get_created_by(self):
        """
        Get the user that created the album
        return: Document.User
        """
        return self.created_by

    def set_created_by(self, this_user):
        """
        Update the creator of the collection
        @param: Document.User
        """
        self.created_by = this_user

    def clean(self):
        """
        Additional validation
        """
