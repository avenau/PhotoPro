from json import loads

from bson.json_util import dumps
from bson.objectid import ObjectId
from lib.album.album import Album
from lib.collection.collection import Collection
from lib.photo.photo import Photo
from lib.token_functions import get_uid
from lib.user.user import User


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
            {"$match": {"user": id, "deleted": False}},
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

    # If signed in
    if req_user:
        req_user_obj = User.objects.get(id=req_user)

    for result in res:
        cur_photo = Photo.objects.get(id=result["id"])
        result["photoStr"] = cur_photo.get_thumbnail(req_user)
        if req_user:
            result["owns"] = (cur_photo in req_user_obj.get_all_purchased()) or (cur_photo.is_photo_owner(req_user_obj))


def user_collection_search(data):
    try:
        req_user = get_uid(data["token"])
    except:
        req_user = ""
    res = Collection.objects.aggregate(
        [
            {
                "$match": {
                    "deleted": False,
                    "$or": [{"private": False}, {"created_by": ObjectId(req_user)}],
                    "created_by": ObjectId(data["query"]),
                }
            },
            {
                "$project": {
                    "title": 1,
                    "authorId": {"$toString": "$created_by"},
                    "created": "$creation_date",
                    "id": {"$toString": "$_id"},
                    "_id": 0,
                }
            },
            {"$skip": data["offset"]},
            {"$limit": data["limit"]},
        ]
    )
    # TODO Possibly return first X photos for thumbnail
    res = loads(dumps(res))
    for result in res:
        result["author"] = User.objects.get(id=result["authorId"]).get_nickname()
    return res


def user_album_search(data):
    res = Album.objects.aggregate(
        [
            {"$match": {"created_by": ObjectId(data["query"]), "deleted": False}},
            {
                "$project": {
                    "title": 1,
                    "authorId": {"$toString": "$created_by"},
                    "created": "$creation_date",
                    "discount": 1,
                    "id": {"$toString": "$_id"},
                    "_id": 0,
                }
            },
            {"$skip": data["offset"]},
            {"$limit": data["limit"]},
        ]
    )
    # TODO Possibly return first X photos for thumbnail
    res = loads(dumps(res))
    for result in res:
        result["author"] = User.objects.get(id=result["authorId"]).get_nickname()
    return res


def user_following_search(data):
    try:
        req_user = get_uid(data["token"])
    except:
        req_user = ""
    res = User.objects().aggregate(
        [
            {"$unwind": "$following"},
            {
                "$project": {
                    "fname": 1,
                    "lname": 1,
                    "nickname": 1,
                    "email": 1,
                    "location": 1,
                    "created": 1,
                    "id": {"$toString": "$_id"},
                    "_id": 0,
                }
            },
            {"$skip": data["offset"]},
            {"$limit": data["limit"]},
        ]
    )
    res = loads(dumps(res))
    return res
