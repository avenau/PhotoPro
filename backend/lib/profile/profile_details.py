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
    req_user_obj = User.objects.get(id=req_user)
    for result in res:
        cur_photo = Photo.objects.get(id=result["id"])
        result["photoStr"] = Photo.objects.get(id=result["id"]).get_thumbnail(req_user)
        result["owns"] = (cur_photo in req_user_obj.get_purchased()) or (cur_photo.is_photo_owner(req_user_obj))

    return res