"""
Showdown related functions
"""
from lib.photo.photo import Photo
from lib.showdown.participant import Participant
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
    @param: req_user:string
    return: {
        participants: [{
            photoStr: string,
            metadata: string,
            id: string,
            owns: boolean,
            votes: length,
            participantId: string
        }],
        prevWinnerPhoto: {
            photoStr: string,
            metadata: string,
            id: string,
            owns: boolean,
        },
        currentVote: string
    }
    """
    current_showdown = Showdown.objects().order_by("-start_date").first()
    if current_showdown == None:
        return {
            "participants": [],
            "prevWinnerPhoto": None,
            "currentVote": "",
        }
    try:
        req_user_obj = User.objects.get(id=req_user)
    except:
        req_user_obj = None

    # Get details about the previous showdown photo and winner
    prev_winner = current_showdown.get_prev_winner()
    prev = None
    if prev_winner != None:
        prev_winner_photo = prev_winner.get_photo()
        prev = loads(prev_winner_photo.to_json())
        prev["metadata"], prev["photoStr"] = prev_winner_photo.get_thumbnail(req_user)
        prev["id"] = str(prev_winner_photo.get_id())
        prev["owns"] = prev_winner_photo.is_owned(req_user_obj)
        for key in to_ignore:
            prev.pop(key)

    participants = current_showdown.get_participants()
    photos = []
    current_vote = ""
    for participant in participants:
        photo = participant.get_photo()
        if photo.is_deleted():
            photo_json = {"deleted": True, "votes": 0, "id": f"empty{len(photos)}"}
            photos.append(photo_json)
            continue
        photo_json = loads(photo.to_json())
        photo_json["metadata"], photo_json["photoStr"] = photo.get_thumbnail(req_user)
        photo_json["id"] = str(photo.get_id())
        photo_json["owns"] = photo.is_owned(req_user_obj)
        photo_json["votes"] = len(participant.get_votes())
        photo_json["participantId"] = str(participant.get_id())
        for key in to_ignore:
            photo_json.pop(key)
        if req_user_obj in participant.get_votes():
            current_vote = str(participant.get_id())
        photos.append(photo_json)

    return {
        "participants": photos,
        "prevWinnerPhoto": prev,
        "currentVote": current_vote,
    }


def count_wins_user(id):
    """
    Count all of the showdowns that the user with id given has won
    @param: id:string
    return: int
    """
    wins = 0
    user = User.objects.get(id=id)
    wins = Participant.objects(won=True, user=user).count()
    return wins


def count_wins_photo(id):
    """
    Count all of the showdowns that the user with id given has won
    @param: id:string
    return: int
    """
    wins = 0
    photo = Photo.objects.get(id=id)
    wins = Participant.objects(won=True, photo=photo).count()
    return wins
