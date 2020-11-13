"""
Purchases helper functions
"""

from json import loads

from bson.json_util import dumps
from bson.objectid import ObjectId
from lib.photo.photo import Photo
from lib.token_functions import get_uid
from lib.user.user import User
from lib import Error


def get_purchased_photos(data):
    """
    @param data: {token: string,
                  offset: int,
                  limit: int}
    """
    try:
        u_id = get_uid(data["token"])
    except:
        raise Error.UserDNE("Couldn't identify you.")

    skip = data["offset"]
    limit = data["limit"]
    user_obj = User.objects.get(id=u_id)
    purchased_photos = user_obj.get_all_purchased()[skip : skip + limit]

    res = []
    for photo_obj in purchased_photos:
        tmp_dict = {}
        tmp_dict["id"] = str(photo_obj.get_id())
        tmp_dict["title"] = photo_obj.get_title()
        tmp_dict["price"] = photo_obj.get_price()
        tmp_dict["discount"] = photo_obj.get_discount()
        tmp_dict["user"] = str(photo_obj.get_user().get_id())
        tmp_dict["owns"] = True
        res.append(tmp_dict)

    for result in res:
        result["metadata"], result["photoStr"] = Photo.objects.get(
            id=result["id"]
        ).get_thumbnail(u_id)

    return res
