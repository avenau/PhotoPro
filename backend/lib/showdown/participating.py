"""
Participating Class for mongoengine
"""

from mongoengine import ListField
from mongoengine import Document
from mongoengine import ReferenceField
from mongoengine.fields import BooleanField

import lib.photo.photo as photo
import lib.user.user as user


class Paticipating(Document):
    """
    Mongoengine Participation definition
    """

    photo = ReferenceField("photo.Photo")
    votes = ListField(ReferenceField("user.User"))
    won = BooleanField(default=False)

    # Participating Methods:
    # ----------------------

    def add_vote(self, vote_user):
        self.votes.append(vote_user)

    def get_votes(self):
        return self.votes

    def get_photo(self):
        return self.photo

    def set_photo(self, new_photo):
        self.photo = new_photo

    def get_won(self):
        return self.won

    def set_won(self, status):
        self.won = status