"""
Showdown related functions
"""
from bson.objectid import ObjectId
from lib.showdown.showdown import Showdown
from json import loads
from lib.user.user import User


def get_data(req_user):
    """
    Get all of the data related to showdown
    """
    current_showdown = Showdown.objects().order_by("-start_date").first()

    # Get details about the previous showdown photo and winner
    prev_winner = current_showdown.get_prev_winner()
    creator = None
    prev = None
    if prev_winner != None:
        creator = loads(prev_winner.get_user().to_json())
        prev = loads(prev_winner.to_json())
        prev["photoStr"] = prev_winner.get_thumbnail(req_user)

    participants = current_showdown.get_participants()
    photos = []
    current_vote = ""
    for participant in participants:
        photo = participant.get_photo()
        photo_json = loads(photo.to_json())
        photo_json["photoStr"] = photo.get_thumbnail(req_user)
        photos.append(photo_json)
        print(participant.get_votes())
        if req_user != "" and User.objects.get(id=req_user) in participant.get_votes():
            print("gotvote")
            current_vote = str(participant.get_id())

    return {
        "participants": photos,
        "prev_winner_photo": prev,
        "prev_winner_user": creator,
        "current_vote": current_vote,
    }
