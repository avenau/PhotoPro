"""
PopularPhoto Class for mongoengine
"""

from mongoengine import IntField
from mongoengine import Document
from mongoengine import ReferenceField

import lib.photo.photo as photo


class PopularPhoto(Document):
    """
    Mongoengine PopularPhoto definition
    """

    # Which photo is being tracked
    photo = ReferenceField("photo.Photo")
    # Number of likes received
    likes = IntField()

    meta = {"collection": "popular-photos"}

    # PopularPhoto Methods:
    # -----------------
    def get_id(self):
        """
        Object id of this entry
        """
        return self.id

    def get_photo(self):
        """
        Object id of the photo
        """
        return self.id

    def add_like(self):
        """
        Add a like
        """
        self.likes += 1

    def remove_like(self):
        """
        Remove a like - THIS SHOULD ALLOW NEGATIVE VALUES
        """
        self.likes -= 1

    # PopularPhoto Document validation
    # ------------------------
    def clean(self):
        """
        Run on every PopularPhoto.save()
        Add validation checks here
        """
