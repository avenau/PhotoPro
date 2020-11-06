"""
Methods relating to getting search results
"""
from json import loads
from bson.json_util import dumps

from lib.collection.collection import Collection
from lib.user.user import User
from lib.photo.photo import Photo

from lib.token_functions import get_uid


def get_sort_method(sortid):
    """
    Get the mongodb sort command associated with the id given
    """
    if sortid == "recent":
        return {"$sort": {"posted": -1}}
    if sortid == "old":
        return {"$sort": {"posted": 1}}
    if sortid == "low":
        return {"$sort": {"price": 1}}
    if sortid == "high":
        return {"$sort": {"price": -1}}
    if sortid == "az":
        return {"$sort": {"title": 1, "nickname": 1}}
    if sortid == "za":
        return {"$sort": {"title": -1, "nickname": -1}}


def user_search(data):
    """
    Search user collection
    """
    sort = get_sort_method(data["orderby"])
    res = User.objects.aggregate(
        [
            {
                "$match": {
                    "$or": [
                        {"fname": {"$regex": data["query"], "$options": "i"}},
                        {"lname": {"$regex": data["query"], "$options": "i"}},
                        {"nickname": {"$regex": data["query"], "$options": "i"}},
                    ]
                }
            },
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
            sort,
            {"$skip": data["offset"]},
            {"$limit": data["limit"]},
        ]
    )
    res = loads(dumps(res))
    return res


def photo_search(data):
    """
    Search photo collection
    """
    sort = get_sort_method(data["orderby"])
    valid_extensions = [".jpg", ".jpeg", ".png", ".gif", ".svg"]
    if data["filetype"] == "jpgpng":
        valid_extensions = [".jpg", ".jpeg", ".png"]
    elif data["filetype"] == "gif":
        valid_extensions = [".gif"]
    elif data["filetype"] == "svg":
        valid_extensions = [".svg"]

    try:
        req_user = get_uid(data["token"])
    except:
        req_user = ""

    price_filter = [{"price": {"$gt": float(data["priceMin"])}}]

    if float(data["priceMax"]) != -1:
        price_filter = [
            {"price": {"$gt": float(data["priceMin"])}},
            {"price": {"$lt": float(data["priceMax"])}},
        ]

    res = Photo.objects.aggregate(
        [
            {
                "$match": {
                    "$or": [
                        {"title": {"$regex": data["query"], "$options": "i"}},
                        {"tags": {"$in": [data["query"]]}},
                    ],
                    "extension": {"$in": valid_extensions},
                    "deleted": False,
                    "$and": price_filter,
                }
            },
            {
                "$project": {
                    "title": 1,
                    "price": 1,
                    "discount": 1,
                    "metadata": 1,
                    "extension": 1,
                    "posted": 1,
                    "user": {"$toString": "$user"},
                    "id": {"$toString": "$_id"},
                    "_id": 0,
                }
            },
            sort,
            {"$skip": data["offset"]},
            {"$limit": data["limit"]},
        ]
    )
    res = loads(dumps(res))

    # If signed in
    if req_user:
        req_user_obj = User.objects.get(id=req_user)

    for result in res:
        if req_user:
            result["owns"] = (cur_photo in req_user_obj.get_all_purchased()) or (cur_photo.is_photo_owner(req_user_obj))
        cur_photo = Photo.objects.get(id=result["id"])
        result["photoStr"] = cur_photo.get_thumbnail(req_user)
        

    return res


def collection_search(data):
    """
    Search collections collection
    """
    sort = get_sort_method(data["orderby"])
    res = Collection.objects.aggregate(
        [
            {
                "$match": {
                    "$or": [
                        {"fname": {"$regex": data["query"], "$options": "i"}},
                        {"lname": {"$regex": data["query"], "$options": "i"}},
                        {"nickname": {"$regex": data["query"], "$options": "i"}},
                    ]
                }
            },
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
            sort,
            {"$skip": data["offset"]},
            {"$limit": data["limit"]},
        ]
    )
    res = loads(dumps(res))
    return res
