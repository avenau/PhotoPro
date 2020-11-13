"""
Get popular contributors from the platform

"""
import json
from lib.popular.popular_users import PopularUser
from lib.user.user import User
from bson.objectid import ObjectId
from bson.json_util import dumps


def get_popular_contributors_images(artists=10):
    """
    Get top liked artists (default top 10)
    {
        name: string
        artistImg : string
        user : string (id)
    }
    """
    res = PopularUser.objects.aggregate(
        [
            {"$match": {"likes": {"$gt": 0}}},
            {"$project": {"user": {"$toString": "$user"}, "likes": "$likes"}},
            {"$sort": {"likes": -1, "user": -1}},
            {"$limit": artists},
        ]
    )
    res = json.loads(dumps(res))

    for photo in res:
        # Get the artist thumbnails
        user = User.objects.get(id=photo["user"])
        photo["artistImg"] = user.get_profile_pic()
        photo["name"] = user.get_nickname()
    return res
