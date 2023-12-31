"""
Album class.
"""

import traceback
from mongoengine import IntField
import lib.catalogue.catalogue as catalogue
import lib.album.validation as validation
import lib.Error as Error


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
        return: discount: int
        """
        return self.discount

    def set_discount(self, discount):
        """
        Set the price of the album
        @param: discount: int
        """
        self.discount = discount

    def remove_photo(self, old_photo):
        """
        Remove a photo from this collection
        Remove this collection from the photo
        @param photo: Document.Photo
        """
        if self in old_photo.albums:
            old_photo.albums.remove(self)
            old_photo.save()

        if old_photo in self.photos:
            self.photos.remove(old_photo)
            self.save()

    def clean(self):
        """
        Additional validation
        Check that photos are owned by the owner of the album
        """
        _user = self.created_by
        if self.id:
            if Album.objects(
                created_by=self.created_by, title=self.title, id__ne=self.id
            ):
                raise Error.ValidationError(
                    "Cannot have two Albums with the same title"
                )
        else:
            if Album.objects(created_by=self.created_by, title=self.title):
                raise Error.ValidationError(
                    "Cannot have two Albums with the same title"
                )

        for photo in self.photos:
            if photo.get_user() != self.get_created_by():
                print(traceback.format_exc())
                raise Error.ValidationError("You don't own this photo")
