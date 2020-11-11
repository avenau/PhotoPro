"""
Showdown related functions
"""
from lib.showdown.showdown import Showdown
from json import loads
from lib.user.user import User

to_ignore = [
    "_id",
    "posted",
    "user",
    "albums",
    "collections",
    "tags",
    "comments",
]


def get_data(req_user):
    """
    Get all of the data related to showdown
    """
    current_showdown = Showdown.objects().order_by("-start_date").first()
    try:
        req_user_obj = User.objects.get(id=req_user)
    except:
        req_user_obj = None

    # Get details about the previous showdown photo and winner
    prev_winner = current_showdown.get_prev_winner()
    prev = None
    if prev_winner != None:
        prev = loads(prev_winner.to_json())
        prev["metadata"], prev["photoStr"] = prev_winner.get_thumbnail(req_user)
        prev["id"] = str(prev_winner.get_id())
        prev["owns"] = prev_winner.is_owned(req_user_obj)
        for key in to_ignore:
            prev.pop(key)

    participants = current_showdown.get_participants()
    photos = []
    current_vote = ""
    for participant in participants:
        photo = participant.get_photo()
        photo_json = loads(photo.to_json())
        photo_json["metadata"], photo_json["photoStr"] = photo.get_thumbnail(req_user)
        photo_json["id"] = str(photo.get_id())
        photos.append(photo_json)
        photo_json["owns"] = photo.is_owned(req_user_obj)
        for key in to_ignore:
            photo_json.pop(key)
        if req_user_obj in participant.get_votes():
            current_vote = str(participant.get_id())

    return {
        "participants": photos,
        "prevWinnerPhoto": prev,
        "currentVote": current_vote,
    }
