import json
from lib.popular.popular_photos import PopularPhoto
from lib.photo.photo import Photo
from lib.user.user import User
from bson.objectid import ObjectId
from bson.json_util import dumps


def get_popular_images(u_id, offset, limit):
    """
    Get the most popular images from the platform at the moment
    @param: u_id:string
    @param: offset:int
    @param: limit:int
    Returns
    -------
    [{
        title : string
        price : int
        discount : int
        photoStr : string
        metadata : string
        likes: int
        owns: boolean
        id : string
    }]
    """
    res = PopularPhoto.objects.aggregate(
        [
            {"$match": {"likes": {"$gte": 0}}},
            {"$project": {"id": {"$toString": "$photo"}, "likes": "$likes"}},
            {"$sort": {"likes": -1}},
            {"$skip": offset},
            {"$limit": limit},
        ]
    )

    res = json.loads(dumps(res))

    try:
        # Get purchased photos of register user
        cur_user = User.objects.get(id=u_id)
        purchased = cur_user.get_purchased()
    except:
        # Anonymous user
        purchased = []

    deleted_photos = []

    for result in res:
        _photo = Photo.objects.get(id=result["id"])
        result["title"] = _photo.get_title()
        result["price"] = _photo.get_price()
        result["discount"] = _photo.get_discount()
        result["likes"] = _photo.get_likes()

        result["metadata"], result["photoStr"] = _photo.get_thumbnail(u_id)
        # Check if photo is deleted, if it is, remove from result list
        if _photo.is_deleted():
            deleted_photos.append(result)
        else:
            if u_id == str(_photo.get_user().get_id()):
                result["owns"] = True
            elif _photo in purchased:
                result["owns"] = True
            else:
                result["owns"] = False

    res = [i for i in res if i not in deleted_photos]
    return res
