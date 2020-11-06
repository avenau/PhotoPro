"""
Computes photos to recommend to a user

"""
import mongoengine
import lib.user
import json
from bson.json_util import dumps
from lib.token_functions import get_uid
from lib.photo.photo import Photo
from bson.objectid import ObjectId



def aggregate_photo_keywords(photos):
    """
    Return title and tags in photos.
    @param: list(Photo obj)
    @returns: list(str(keyword))
    """
    keywords = []

    for photo in photos:
        title = photo.get_title()
        titleWords = title.split()
        for i in titleWords:
            keywords.append(i.lower())

        tags = photo.get_tags()
        keywords += tags

    return keywords

def get_top_keywords(keywords, count=10):
    """
    Get most frequently occuring (tags and titles) from a list of keywords
    """
    freq = {}
    for word in keywords:
        if freq.get(word) == None:
            freq[word] = 0
        freq[word] += 1
    freq = sorted(freq, key=freq.get, reverse=True)[:count]
    return freq

def search_history_keywords(u_id):
    """
    Get tags and titles of count/25 most recently purchased photos of user

    Returns: list(keywords)
    """
    user = lib.user.user.User.objects.get(id=u_id)
    searches = user.get_searches()

    keywords = []
    for search in searches:
        search_word = search.split()
        for i in search_word:
            keywords.append(i.lower())
    return keywords



def liked_photo_keywords(u_id, count=10):
    """
    Get tags and titles of count/25 most recently like photos of user

    Returns: list(keywords)
    """
    user = lib.user.user.User.objects.get(id=u_id)
    liked_photos = user.get_liked()[-count:]

    photo_keywords = aggregate_photo_keywords(liked_photos)
    return photo_keywords


def purchased_photo_keywords(u_id, count=10):
    """
    Get tags and titles of count/25 most recently liked photos of user

    Returns: list(keywords)
    """
    user = lib.user.user.User.objects.get(id=u_id)
    purchased = user.get_purchased()[-count:]

    photo_keywords = aggregate_photo_keywords(purchased)

    return photo_keywords


def recommend_keywords(u_id):
    """
    Get the default or 10 top photo keywords based on recently liked,
    purchased and searched photos
    @param: u_id str
    @returns: list(str(keywords))

    """
    liked_kw = liked_photo_keywords(u_id)
    purchased_kw = purchased_photo_keywords(u_id)
    search_kw = search_history_keywords(u_id)

    kw = liked_kw + purchased_kw + search_kw
    kw = get_top_keywords(kw)
    kw = list(set(kw))
    try:
        user = lib.user.user.User.objects.get(id=u_id)
        user.set_recommend_keywords(kw)
        user.save()
        return {"success": True}
    except:
        return {"success": False}

def recommend_photos(data):
    u_id = get_uid(data["token"])
    user = lib.user.user.User.objects.get(id=u_id)
    keywords = user.get_recommend_keywords()
    print(keywords)
    
    valid_extensions = [".jpg", ".jpeg", ".png", ".gif", ".svg"]
    if data["filetype"] == "jpgpng":
        valid_extensions = [".jpg", ".jpeg", ".png"]
    elif data["filetype"] == "gif":
        valid_extensions = [".gif"]
    elif data["filetype"] == "svg":
        valid_extensions = [".svg"]

    res = Photo.objects.aggregate(
        [
            {
                "$match": {
                    
                    "$or": [
                        {"title": {"$in": keywords}},
                        {"tags": {"$in": keywords}},
                    ],
                    "extension": {"$in": valid_extensions},
                    "deleted": False,
                    "user": {"$ne": ObjectId(u_id)}
                }
            },
            {
                "$project": {
                    "title": 1,
                    "price": 1,
                    "discount": 1,
                    "metadata": 1,
                    "extension": 1,
                    "created": "$posted",
                    "user": {"$toString": "$user"},
                    "id": {"$toString": "$_id"},
                    "_id": 0,
                }
            },
            {"$skip": data["offset"]},
            {"$limit": data["limit"]},
        ]
    )
    res = json.loads(dumps(res))
    for result in res:
        result["photoStr"] = Photo.objects.get(id=result["id"]).get_thumbnail(u_id)
    return res