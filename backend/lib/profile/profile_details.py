from json import loads

from bson.json_util import dumps
from bson.objectid import ObjectId
from lib.album.album import Album
from lib.collection.collection import Collection
from lib.photo.photo import Photo
from lib.token_functions import get_uid
from lib.user.user import User
from lib import Error


def get_profile_details(data):
    try:
        searcher = User.objects.get(id=get_uid(data["token"]))
        following = searcher.get_following()
    except:
        following = []

    try:
        profile_owner = User.objects.get(id=data["u_id"])
    except:
        raise Error.UserDNE("User you're looking for doesn't exist.")

    following = profile_owner in following
    return {
        "fname": profile_owner.get_fname(),
        "lname": profile_owner.get_lname(),
        "nickname": profile_owner.get_nickname(),
        "location": profile_owner.get_location(),
        "email": profile_owner.get_email(),
        "profilePic": profile_owner.get_profile_pic(),
        "aboutMe": profile_owner.get_about_me(),
        "following": following,
        "contributor": bool(profile_owner.get_posts()),
    }


def user_photo_search(data):
    """
    @param data{
        offset: int
        limit: int
        token: string
        query: string
    }
    """
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
            result["owns"] = (cur_photo in req_user_obj.get_all_purchased()) or (
                cur_photo.is_photo_owner(req_user_obj)
            )

    return res


def user_collection_search(data):
    """
    @param data{
        offset: int
        limit: int
        token: string
        query: string
    }
    """
    try:
        req_user = get_uid(data["token"])
    except:
        req_user = ""

    # If anonymouse user, everything that is public by the queries user
    if req_user == "":
        query = [{"private": False}]
    # If logged in user, everything that is public AND private IF the user
    # created it
    else:
        query = [{"private": False}, {"created_by": ObjectId(req_user)}]
    res = Collection.objects.aggregate(
        [
            {
                "$match": {
                    "$or": query,
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
    res = loads(dumps(res))
    for result in res:
        result["author"] = User.objects.get(id=result["authorId"]).get_nickname()
    return res


def user_following_search(data):
    try:
        u_id = get_uid(data["token"])
    except:
        raise Error.UserDNE(
            "Sorry, couldn't identify you. Try logging out and back in."
        )

    skip = data["offset"]
    limit = data["limit"]
    user_obj = User.objects.get(id=u_id)
    following_list = user_obj.get_following()[skip : skip + limit]

    res = []
    for followed in following_list:
        tmp_dict = {}
        tmp_dict["id"] = str(followed.get_id())
        tmp_dict["nickname"] = followed.get_nickname()
        tmp_dict["fname"] = followed.get_fname()
        tmp_dict["lname"] = followed.get_lname()
        tmp_dict["email"] = followed.get_email()
        tmp_dict["location"] = followed.get_location()
        tmp_dict["profilePic"] = followed.get_profile_pic()
        tmp_dict["contributor"] = bool(followed.get_posts())
        tmp_dict["following"] = (
            followed in user_obj.get_following()[skip : skip + limit]
        )
        res.append(tmp_dict)

    return res
