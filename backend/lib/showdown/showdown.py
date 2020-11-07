"""
User Class for mongoengine
"""

import datetime
from datetime import timedelta
from mongoengine import ListField
from mongoengine import IntField
from mongoengine import Document
from mongoengine import ReferenceField
from mongoengine.fields import DateTimeField

import lib.photo.photo as photo
import lib.user.user as user
import lib.showdown.participating
import lib.showdown.validation as validation
import lib.Error as Error


class Showdown(Document):
    """
    Mongoengine Showdown definition
    """

    # When did the showdown begin
    start_date = DateTimeField(default=datetime.datetime.now())
    # Which photo was the winner of this showdown
    winner = ReferenceField("photo.Photo")
    # Which photos are participating in the showdown
    participating = ListField(
        ReferenceField("lib.showdown.participating.Participating"),
        validation=validation.validate_participating,
    )
    # Previous showdown
    previous = ReferenceField("self")
    # Duration of the showdown in hours
    duration = IntField()
    meta = {"collection": "showdown"}

    # Showdown Methods:
    # -----------------
    def get_id(self):
        """
        Object id of the user
        """
        return self.id

    def has_ended(self):
        """
        Get whether this showdown has ended
        """
        return datetime.datetime.now() > self.get_start_date() + timedelta(
            hours=self.get_duration()
        )

    def get_duration(self):
        """
        Get the duration in hours of the showdown
        """
        return self.duration

    def set_duration(self, hours):
        """
        Set the duration in hours of the showdown
        """
        self.duration = hours

    def add_participant(self, participant):
        """
        Add a participant to the showdown
        """
        self.participating.append(participant)

    def get_start_date(self):
        """
        Get the start datetime of the showdown
        """
        return self.start_date

    def was_last(self):
        """
        Get the start datetime of the showdown
        """
        return datetime.datetime.now() < self.get_start_date() + (
            2 * timedelta(hours=self.get_duration())
        )

    # User Document validation
    # ------------------------
    def clean(self):
        """
        Run on every User.save()
        Add validation checks here
        """
