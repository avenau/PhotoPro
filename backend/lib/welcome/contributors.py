"""
Get popular contributors from the platform

"""
import os
import json
import mongoengine
from lib.photo.photo import Photo
from lib.user.user import User
from bson.objectid import ObjectId
from bson.json_util import dumps


PORT = os.getenv("BACKEND_PORT")
BACKEND_PATH = 'static/'
FRONTEND_PATH = 'http://localhost:' + str(PORT) + '/static/'


def get_popular_contributors_images():
    return (FRONTEND_PATH + 'contributor1.png',
            FRONTEND_PATH + 'contributor2.png')

def compute_popular_contributors(artists=5):
    """
    Get top liked artists (default top 5) in the last X hrs 

    - Get photos from posted in last x days
    - Sort by most likes 

    - need to get artist thumbnail
    - photo thumbnail
    - artist name

    {
        artist name: string
        photoStr : string
        metadata : string
        artist_id : string
    }
    """
    res = Photo.objects.aggregate(
        [
            {
                "$match": {
                    "deleted": False,
                }
            },
            {
                "$project": {
                    "user": {"$toString": "$user"},
                    "photoId": {"$toString": "$_id"},
                    "likes": "$likes"

                }
            },
            {"$sort": {"likes": -1}},
            {"$limit": artists},
            {
                "$group": {
                    "_id": "$user",
                }
            }
        ]
    )
    res = json.loads(dumps(res))
    print('heello')
    print(res)
    print('heello')

    for photo in res:
        # Get the artist thumbnails
        user = User.objects.get(id=photo["_id"])
        photo["artistImg"] = user.get_profile_pic()
        photo["name"] = user.get_fname() + " " + user.get_lname()
        # photo["photoStr"] = Photo.objects.get(id=photo["_id"]).get_thumbnail(photo["user"])
    return res

    
    

