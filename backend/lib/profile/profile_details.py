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
                    "extension": 1,
                    "posted": 1,
                    "user": {"$toString": "$user"},
                    "id": {"$toString": "$_id"},
                    "_id": 0,
                }
            },
            {"$sort": {"posted": -1}},
            {"$skip": data["offset"]},
            {"$limit": data["limit"]},
        ]
    )
    res = loads(dumps(res))

    # If signed in
    if req_user:
        req_user_obj = User.objects.get(id=req_user)
    else:
        req_user_obj = None

    for result in res:
        cur_photo = Photo.objects.get(id=result["id"])
        result["metadata"], result["photoStr"] = cur_photo.get_thumbnail(req_user)
        if req_user:
            result["owns"] = (cur_photo in req_user_obj.get_all_purchased()) or (cur_photo.is_photo_owner(req_user_obj))

    return res

def user_collection_search(data):
    try:
        req_user = get_uid(data["token"])
    except:
        req_user = ""
    res = Collection.objects.aggregate(
        [
            {
                "$match": {
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
            {"$match": {"created_by": ObjectId(data["query"])}},
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
        u_id = get_uid(data["token"])
    except:
        raise Error.UserDNE("Sorry, couldn't identify you. Try logging out and back in.")
    
    skip = data["offset"]
    limit = data["limit"]
    user_obj = User.objects.get(id=u_id)
    following = user_obj.get_following()[skip:skip+limit]

    res = []
    for followed in following:
        tmp_dict = {}
        tmp_dict['id'] = str(followed.get_id())
        tmp_dict['nickname'] = followed.get_nickname()
        tmp_dict['fname'] = followed.get_fname()
        tmp_dict['lname'] = followed.get_lname()
        tmp_dict['email'] = followed.get_email()
        tmp_dict['location'] = followed.get_location()
        tmp_dict['profilePic'] = followed.get_profile_pic()
        res.append(tmp_dict)

    return res
