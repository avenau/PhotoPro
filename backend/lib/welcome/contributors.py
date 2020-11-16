"""
Get popular contributors from the platform

"""
import json
from lib.popular.popular_users import PopularUser
from lib.user.user import User
from bson.objectid import ObjectId
from bson.json_util import dumps


def get_popular_contributors_images(offset, limit):
    """
    Get top liked artists (default top 10) from x period of time
    return [{
        name: string
        artistImg : string
        user : string (id)
    }]
    """
    max = 15
    if limit + offset > max:
        limit = max - offset

    if limit < 0:
        return []

    res = PopularUser.objects.aggregate(
        [
            {"$match": {"likes": {"$gte": 1}}},
            {"$project": {"user": {"$toString": "$user"}, "likes": "$likes"}},
            {"$sort": {"likes": -1, "user": -1}},
            {"$skip": offset},
            {"$limit": limit},
        ]
    )
    res = json.loads(dumps(res))

    for photo in res:
        # Get the artist thumbnails
        user = User.objects.get(id=photo["user"])
        photo["artistImg"] = user.get_profile_pic()
        photo["name"] = user.get_nickname()
    return res
