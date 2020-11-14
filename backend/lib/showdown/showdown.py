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
    start_date = DateTimeField(required=True, validation=validation.validate_start_date)
    # Which photo was the winner of this showdown
    winner = ReferenceField("participant.Participant")
    # Which photos are participating in the showdown
    participants = ListField(
        ReferenceField("participant.Participant"),
        validation=validation.validate_participants,
    )
    # Previous showdown
    previous = ReferenceField("self")
    # Duration of the showdown in minutes
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
        return datetime.now() > self.get_start_date() + timedelta(
            minutes=self.get_duration()
        )

    def get_winner(self):
        """
        Get the winner of the current showdown
        """
        if self.winner:
            return self.winner
        return self.get_prev_winner()

    def get_prev_winner(self):
        """
        Get the winner of the previous showdown
        """
        if self.previous == None:
            return None
        return self.previous.get_winner()

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
            + timedelta(minutes=self.get_duration())
            - datetime.now()
        )

    def get_participants(self):
        """
        Get all participants in the current showdown
        """
        return self.participants

    def declare_winner(self):
        """
        If a winner has not yet been declared then declare one
        If one of the photos has been deleted then the other is automatically the winner
        """
        if len(self.participants) != 2:
            return

        p0 = self.participants[0]
        p1 = self.participants[1]

        if (
            p0.count_votes() > p1.count_votes() or p1.is_deleted()
        ) and not p0.is_deleted():
            # p0 is winner
            p0.set_won(True)
            p0.save()
            self.winner = p0
        elif (
            p0.count_votes() < p1.count_votes() or p0.is_deleted()
        ) and not p1.is_deleted():
            # p1 is winner
            p1.set_won(True)
            p1.save()
            self.winner = p1

    # User Document validation
    # ------------------------
    def clean(self):
        """
        Run on every User.save()
        Add validation checks here
        """
        pass
