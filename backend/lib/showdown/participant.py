"""
Participant Class for mongoengine
"""

from mongoengine import ListField
from mongoengine import Document
from mongoengine import ReferenceField
from mongoengine.fields import BooleanField

import lib.photo.photo as photo
import lib.user.user as user


class Participant(Document):
    """
    Mongoengine Participant definition
    """

    photo = ReferenceField("photo.Photo")
    votes = ListField(ReferenceField("user.User"))
    won = BooleanField(default=False)
    meta = {"collection": "participant"}

    # Participating Methods:
    # ----------------------

    def add_vote(self, vote_user):
        self.votes.append(vote_user)

    def remove_vote(self, vote_user):
        try:
            self.votes.remove(vote_user)
        except Exception:
            pass

    def get_votes(self):
        return self.votes

    def count_votes(self):
        return self.votes

    def get_photo(self):
        return self.photo

    def set_photo(self, new_photo):
        self.photo = new_photo

    def has_won(self):
        return self.won

    def set_won(self, status):
        self.won = status