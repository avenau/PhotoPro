"""
User Class for mongoengine
"""

from datetime import timedelta, datetime
from mongoengine import ListField
from mongoengine import IntField
from mongoengine import Document
from mongoengine import ReferenceField
from mongoengine.fields import DateTimeField

import lib.photo.photo as photo
import lib.user.user as user
import lib.showdown.participant as participant
import lib.showdown.validation as validation
import lib.Error as Error


class Showdown(Document):
    """
    Mongoengine Showdown definition
    """

    # When did the showdown begin
    start_date = DateTimeField(required=True)
    # Which photo was the winner of this showdown
    winner = ReferenceField("photo.Photo")
    # Which photos are participating in the showdown
    participants = ListField(
        ReferenceField("participant.Participant"),
        validation=validation.validate_participants,
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
        return datetime.now() > self.get_start_date() + timedelta(hours=self.get_duration())

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
        self.participants.append(participant)

    def get_start_date(self):
        """
        Get the start datetime of the showdown
        """
        return self.start_date

    def get_time_remaining(self):
        """
        Get the time remaining in the showdown, this should only
        be used if the showdown has not ended
        """
        return (
            self.get_start_date()
            + timedelta(hours=self.get_duration())
            - datetime.now()
        )

    def declare_winner(self):
        """
        If a winner has not yet been declared then declare one
        """
        if len(self.participants) != 2:
            return

        p0 = self.participants[0]
        p1 = self.participants[1]

        if p0.count_votes() > p1.count_votes():
            # p0 is winner
            p0.set_won(True)
            self.winner = p0
        elif p0.count_votes() < p1.count_votes():
            # p1 is winner
            p1.set_won(True)
            self.winner = p1

    # User Document validation
    # ------------------------
    def clean(self):
        """
        Run on every User.save()
        Add validation checks here
        """
        pass