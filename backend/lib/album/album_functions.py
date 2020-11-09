'''
Album Functions
'''

from json import loads
from bson.json_util import dumps
from bson.objectid import ObjectId
from lib.token_functions import get_uid
import lib.photo.photo as photo
from lib.user.user import User

def update_album(_album, title, discount, tags):
    '''
    @param title: string
    @param discount: int
    @param tags: [string]
    @return success: boolean
    '''
    if title:
        _album.update_title(title)
    if discount:
        _album.set_discount(int(discount))
    if tags:
        _album.add_tags(tags)
    _album.save()
    return True

def album_photo_search(data):
    '''
    Get thumbnails of the photos in an album
    '''
    try:
        req_user = get_uid(data["token"])
    except:
        req_user = ""
    try:
        _id = ObjectId(data["query"])
    except:
        _id = ""
    res = photo.Photo.objects().aggregate(
        [
            {"$match": {"albums": {"$in": [_id, "$albums"]}}},
            {
                "$project": {
                    "title": 1,
                    "price": 1,
                    "discount": 1,
                    "metadata": 1,
                    "extension": 1,
                    '''
                    "is_album": {
                        "$in": [_id, "$albums"]
                        },
                    '''
                    "user": {"$toString": "$user"},
                    "id": {"$toString": "$_id"},
                    "_id": 0,
                },
            },
            {"$skip": data["offset"]},
            {"$limit": data["limit"]},
        ]
    )
    res = loads(dumps(res))
    try:
        # Get purchased photos of register user
        cur_user = User.objects.get(id=req_user)
        purchased = cur_user.get_all_purchased()
    except:
        # Anonymous user
        purchased = []

    for result in res:
        cur_photo = photo.Photo.objects.get(id=result["id"])
        result["photoStr"] = cur_photo.get_thumbnail(req_user)

        if req_user == str(cur_photo.get_user().get_id()):
            result["owns"] = True
        elif cur_photo in purchased:
            result["owns"] = True
        else:
            result["owns"] = False

    return res
    """
    """
