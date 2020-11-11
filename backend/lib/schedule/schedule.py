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
    current_showdown = Showdown.objects().order_by("-start_date").first()
    if current_showdown == None or current_showdown.has_ended():
        # Create new showdown
        current_showdown = create_showdown(current_showdown)

    # Create timer with duration of showdown time remaining
    dur = current_showdown.get_time_remaining()
    timer = Timer(dur.total_seconds(), initialise_schedule)
    timer.setDaemon(True)
    timer.start()


def create_showdown(prev_showdown):
    """
    Create a new showdown entry
    """
    pop_photos = PopularPhoto.objects().order_by("-likes")[:2]
    participants = []
    if len(pop_photos) == 2:
        for pop_photo in pop_photos:
            photo = pop_photo.get_photo()
            participant = Participant(photo=photo)
            participant.save()
            participants.append(participant)

    showdown = Showdown(
        start_date=datetime.now(),
        previous=prev_showdown,
        duration=1440,
        participants=participants,
    )
    showdown.save()

    # Reset the popular lists
    empty_popular()

    # Declare winner for previous showdown
    if prev_showdown != None:
        prev_showdown.declare_winner()

    return showdown


def empty_popular():
    """
    Empty the popular-photos and popular-users databases.
    """
    for photo in PopularPhoto.objects():
        photo.reset_likes()
        photo.save()

    for user in PopularUser.objects():
        user.reset_likes()
        user.save()
