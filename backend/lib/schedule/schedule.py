"""
Manage timers that run to determine showdowns and popular stats
"""

import datetime
from threading import Timer

from lib.showdown.showdown import Showdown
from lib.showdown.participant import Participant
from lib.popular.popular_photos import PopularPhoto
from lib.popular.popular_users import PopularUser

timer = None

def initialise_schedule(length):
    """
    Check for currently running showdowns, if one exist then create a timer
    that will trigger the showdown closing and create a new showdown. If the
    previous showdown should have already ended then end the showdown immediately
    and create a new showdown. All recent activity counts will be reset alongside
    the showdown.
    """
    global timer
    length = int(length)

    if timer != None:
        timer.cancel()

    if length == None or length <= 0:
        length = 1440

    current_showdown = Showdown.objects().order_by("-start_date").first()
    if current_showdown == None or current_showdown.has_ended():
        # Create new showdown
        current_showdown = create_showdown(current_showdown, length)
    # Create timer with duration of showdown time remaining
    dur = current_showdown.get_time_remaining()
    timer = Timer(dur.total_seconds(), initialise_schedule)
    timer.setDaemon(True)
    timer.start()


def create_showdown(prev_showdown, length):
    """
    Create a new showdown entry
    """

    participants = []
    showdown = Showdown(
        start_date=datetime.datetime.now(),
        previous=prev_showdown,
        duration=length,
        participants=participants,
    )

    showdown.save()

    pop_photos = PopularPhoto.objects().order_by("-likes")
    for pop_photo in pop_photos:
        photo = pop_photo.get_photo()
        if photo.is_deleted():
            continue
        participant = Participant(photo=photo, showdown=showdown, user=photo.get_user())
        participant.save()
        participants.append(participant)
        if len(participants) == 2:
            break

    if len(participants) != 2:
        participants = []

    for p in participants:
        showdown.add_participant(p)

    showdown.save()

    # Reset the popular lists
    empty_popular()

    # Declare winner for previous showdown
    if prev_showdown != None:
        prev_showdown.declare_winner()
        prev_showdown.save()

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

def end_showdown():
    """
    If there is a current showdown and it hasn't already ended - end it
    by reducing the duration to the time since it began. Could be set to
    0 but this way the database has a log of how long each showdown lasted
    """
    current_showdown = Showdown.objects().order_by("-start_date").first()
    if current_showdown != None and not current_showdown.has_ended():
        start = current_showdown.get_start_date()
        diff = datetime.datetime.now() - start
        mins = int(diff.total_seconds()/60)
        current_showdown.set_duration(mins)
        current_showdown.save()
