"""
PopularUser Class for mongoengine
"""

from mongoengine import IntField
from mongoengine import Document
from mongoengine import ReferenceField

import lib.user.user as user


class PopularUser(Document):
    """
    Mongoengine PopularUser definition
    """

    # Which user is being tracked
    user = ReferenceField("user.User")
    # Number of likes received
    likes = IntField(default=0)

    meta = {"collection": "popular-users"}

    # PopularUser Methods:
    # -----------------
    def get_id(self):
        """
        Object id of this entry
        """
        return self.id

    def get_user(self):
        """
        Object id of the user
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

    def reset_likes(self):
        """
        Set likes to 0
        """
        self.likes = 0

    # PopularUser Document validation
    # ------------------------
    def clean(self):
        """
        Run on every PopularUser.save()
        Add validation checks here
        """
