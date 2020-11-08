"""
Manage timers that run to determine showdowns and popular stats
"""

from datetime import datetime
from threading import Timer

from lib.showdown.showdown import Showdown
from lib.showdown.participant import Participant
from lib.popular.popular_photos import PopularPhoto
from lib.popular.popular_users import PopularUser


def initialise_schedule():
    """
    Check for currently running showdowns, if one exist then create a timer
    that will trigger the showdown closing and create a new showdown. If the
    previous showdown should have already ended then end the showdown immediately
    and create a new showdown. All recent activity counts will be reset alongside
    the showdown.
    """
    current_showdown = Showdown.objects().order_by("-start_date")[:1]
    if current_showdown.has_ended():
        # Create new showdown
        current_showdown = create_showdown(current_showdown)

    # TODO Start timer here


def create_showdown(prev_showdown):
    """
    Create a new showdown entry
    """
    photos = PopularPhoto.objects().order_by("-likes")[:2]
    participants = []
    if len(photos) == 2:
        for photo in photos:
            participants.append(Participant(photo=photo))

    empty_popular()

    return Showdown(
        start_date=datetime.now(),
        previous=prev_showdown,
        duration=24,
        participants=participants,
    )


def empty_popular():
    """
    Empty the popular-photos and popular-users databases.
    """
    for photo in PopularPhoto.objects():
        photo.reset_likes()

    for user in PopularUser.objects():
        user.reset_likes()
