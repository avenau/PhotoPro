from bson.objectid import ObjectId
from lib.user.user import User
from lib.photo.photo import Photo
from bson.json_util import dumps
from json import loads

from lib.photo.fs_interactions import find_photo
from lib.token_functions import get_uid

def user_photo_search(data):
    try:
        req_user = get_uid(data["token"])
    except:
        req_user = ""
    try:
        id = ObjectId(data["query"])
    except:
        id = ""
    res = Photo.objects().aggregate(
        [
            {
                "$match": {
                    "user": id,
                    "deleted": False
                }
            },
            {
                "$project": {
                    "title": 1,
                    "price": 1,
                    "discount": 1,
                    "metadata": 1,
                    "extension": 1,
                    "user": {"$toString": "$user"},
                    "id": {"$toString": "$_id"},
                    "_id": 0,
                }
            },
            {"$skip": data["offset"]},
            {"$limit": data["limit"]},
        ]
    )
    res = loads(dumps(res))
    for result in res:
        result["photoStr"] = Photo.objects.get(id=result["id"]).get_thumbnail(req_user)
    return res