"""
Album class.
"""

import traceback
from mongoengine import IntField
import lib.catalogue.catalogue as catalogue
import lib.album.validation as validation
import lib.Error as Error

from lib.album.validation import validate_title 

class Album(catalogue.Catalogue):
    """
    Albums have a discount
    Albums consist of photos created by the owner
    """

    discount = IntField(default=0, validation=validation.validate_discount)

    meta = {"collection": "albums"}

    def get_discount(self):
        """
        Get the price of an album
        """
        return self.discount

    def set_discount(self, discount):
        """
        Set the price of the album
        """
        self.discount = discount

    def add_photo(self, photo):
        self.photos.append(photo)

    def remove_photo(self, old_photo):
        """
        Remove a photo from this collection
        Remove this collection from the photo
        @param photo: Photo(Document)
        """
        if self in old_photo.albums:
            old_photo.albums.remove(self)
            old_photo.save()

        if old_photo in self.photos:
            self.photos.remove(old_photo)
            self.save()

    def delete_album(self):
        """
        Delete the album by calling the super class
        Essentially an alias
        """
        super().delete_catalogue()

    def clean(self):
        """
        Additional validation
        Check that photos are owned by the owner of the album
        """
        validate_title(self.title, self.created_by, self.id)

        for photo in self.photos:
            if photo.get_user() != self.get_created_by():
                print(traceback.format_exc())
                raise Error.ValidationError("User does not own photo")
