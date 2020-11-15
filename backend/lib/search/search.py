"""
Methods relating to getting search results
"""
from json import loads
from bson.json_util import dumps
from bson.objectid import ObjectId
import urllib.parse

from lib.album.album import Album
from lib.collection.collection import Collection
from lib.user.user import User
from lib.photo.photo import Photo

from lib.token_functions import get_uid


def get_sort_method(sortid):
    """
    Get the mongodb sort command associated with the id given
    @param: sortid:string
    """
    if sortid == "recent":
        return {"$sort": {"created": -1, "id": -1}}
    if sortid == "old":
        return {"$sort": {"created": 1, "id": 1}}
    if sortid == "low":
        return {"$sort": {"discountedPrice": 1, "id": 1}}
    if sortid == "high":
        return {"$sort": {"discountedPrice": -1, "id": -1}}
    if sortid == "az":
        return {"$sort": {"lower": 1, "id": 1}}
    if sortid == "za":
        return {"$sort": {"lower": -1, "id": -1}}


def user_search(data):
    """
    Search user collection
    @param: data{token: string,
                offset: int,
                limit: int,
                query: string,
                orderby: string}
    return: res:list(dict)
    """
    query = urllib.parse.unquote_plus(data["query"].lower())
    # Handle anon users with this try-except
    try:
        searcher = User.objects.get(id=get_uid(data["token"]))
        following = searcher.get_following()
        for idx, followed in enumerate(following):
            following[idx] = ObjectId(followed.get_id())
    except:
        following = []

    sort = get_sort_method(data["orderby"])
    res = User.objects.aggregate(
        [
            {
                "$project": {
                    "fname": 1,
                    "lname": 1,
                    "nickname": 1,
                    "email": 1,
                    "location": 1,
                    "created": 1,
                    "following": {"$in": ["$_id", following]},
                    "contributor": {
                        "$cond": [{"$gt": [{"$size": "$posts"}, 0]}, True, False]
                    },
                    "lower": {"$toLower": "$nickname"},
                    "profilePic": "$profile_pic",
                    "id": {"$toString": "$_id"},
                    "valid": {
                        "$or": [
                            {
                                "$regexMatch": {
                                    "input": "$fname",
                                    "regex": query,
                                    "options": "i",
                                }
                            },
                            {
                                "$regexMatch": {
                                    "input": "$lname",
                                    "regex": query,
                                    "options": "i",
                                }
                            },
                            {
                                "$regexMatch": {
                                    "input": "$nickname",
                                    "regex": query,
                                    "options": "i",
                                }
                            },
                            {
                                "$regexMatch": {
                                    "input": query,
                                    "regex": "$fname",
                                    "options": "i",
                                }
                            },
                            {
                                "$regexMatch": {
                                    "input": query,
                                    "regex": "$lname",
                                    "options": "i",
                                }
                            },
                            {
                                "$regexMatch": {
                                    "input": query,
                                    "regex": "$nickname",
                                    "options": "i",
                                }
                            },
                        ]
                    },
                }
            },
            {
                "$match": {
                    "valid": True,
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
    @param: data{token: string,
                offset: int,
                limit: int,
                query: string,
                orderby: string}
    return: res:list(dict)
    """
    query = urllib.parse.unquote_plus(data["query"].lower())
    sort = get_sort_method(data["orderby"])

    valid_extensions = [".jpg", ".jpeg", ".png", ".svg"]
    if data["filetype"] == "jpgpng":
        valid_extensions = [".jpg", ".jpeg", ".png"]
    elif data["filetype"] == "svg":
        valid_extensions = [".svg"]

    try:
        req_user = get_uid(data["token"])
        this_user = User.objects.get(id=req_user)
        if query != "":
            this_user.add_search(query)
            this_user.save()
    except:
        req_user = ""

    price_filter = [{"price": {"$gt": float(data["priceMin"])}}]

    if float(data["priceMax"]) != -1:
        price_filter = [
            {"discountedPrice": {"$gt": float(data["priceMin"])}},
            {"discountedPrice": {"$lt": float(data["priceMax"])}},
        ]

    res = Photo.objects.aggregate(
        [
            {
                "$match": {
                    "$or": [
                        {"title": {"$regex": query, "$options": "i"}},
                        {"tags": {"$in": [query]}},
                        {"tags": {"$in": query.split(" ")}},
                    ],
                    "extension": {"$in": valid_extensions},
                    "deleted": False,
                }
            },
            {
                "$project": {
                    "title": 1,
                    "price": 1,
                    "discount": 1,
                    "extension": 1,
                    "created": "$posted",
                    "user": {"$toString": "$user"},
                    "id": {"$toString": "$_id"},
                    "lower": {"$toLower": "$title"},
                    # discountedPrice = round(price - (price * discount/100))
                    "discountedPrice": {
                        "$round": {
                            "$subtract": [
                                "$price",
                                {
                                    "$multiply": [
                                        "$price",
                                        {"$divide": ["$discount", 100]},
                                    ]
                                },
                            ]
                        }
                    },
                    "_id": 0,
                }
            },
            {"$match": {"$and": price_filter}},
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
        cur_photo = Photo.objects.get(id=result["id"])
        result["metadata"], result["photoStr"] = cur_photo.get_thumbnail(req_user)
        if req_user:
            result["owns"] = (cur_photo in req_user_obj.get_all_purchased()) or (
                cur_photo.is_photo_owner(req_user_obj)
            )

    return res


def collection_search(data):
    """
    Search collections collection
    @param: data{token: string,
                offset: int,
                limit: int,
                query: string,
                orderby: string}
    return: res:list(dict)
    """
    query = urllib.parse.unquote_plus(data["query"].lower())
    sort = get_sort_method(data["orderby"])
    try:
        req_user = get_uid(data["token"])
        req_user = ObjectId(req_user)
    except:
        req_user = ""
    res = Collection.objects.aggregate(
        [
            {
                "$match": {
                    "$or": [
                        {"title": {"$regex": query, "$options": "i"}},
                        {"tags": {"$in": [query]}},
                        {"tags": {"$in": query.split(" ")}},
                    ],
                    "$or": [{"private": False}, {"created_by": req_user}],
                }
            },
            {
                "$project": {
                    "title": 1,
                    "authorId": {"$toString": "$created_by"},
                    "created": "$creation_date",
                    "lower": {"$toLower": "$title"},
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
    for result in res:
        result["author"] = User.objects.get(id=result["authorId"]).get_nickname()

    return res


def album_search(data):
    """
    Search albums collection
    @param: data{token: string,
                offset: int,
                limit: int,
                query: string,
                orderby: string}
    return: res:list(dict)
    """
    query = urllib.parse.unquote_plus(data["query"].lower())
    sort = get_sort_method(data["orderby"])
    res = Album.objects.aggregate(
        [
            {
                "$match": {
                    "$or": [
                        {"title": {"$regex": query, "$options": "i"}},
                        {"tags": {"$in": [query]}},
                        {"tags": {"$in": query.split(" ")}},
                    ],
                }
            },
            {
                "$project": {
                    "title": 1,
                    "authorId": {"$toString": "$created_by"},
                    "created": "$creation_date",
                    "lower": {"$toLower": "$title"},
                    "discount": 1,
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
    for result in res:
        result["author"] = User.objects.get(id=result["authorId"]).get_nickname()
    return res
