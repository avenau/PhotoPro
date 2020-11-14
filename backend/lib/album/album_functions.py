"""
Miscellaneous Album functions
"""

from json import loads
from bson.json_util import dumps
from bson.objectid import ObjectId
from lib.token_functions import get_uid
import lib.photo.photo as photo
from lib.user.user import User
from lib.album.album import Album


def update_album(_album, title, discount, tags):
    """
    Update details of a user's album
    @param title: string
    @param discount: int
    @param tags: [string]
    return: boolean
    """
    if title:
        _album.update_title(title)
    if discount:
        _album.set_discount(int(discount))
    if tags:
        _album.set_tags(tags)
    _album.save()
    return True


def album_photo_search(data):
    """
    Get thumbnails of the photos in an album
    @param: data: dict
    return: [Document.Photo]
    """
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
                    "deleted": 1,
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

    remove_photo = []
    for result in res:
        cur_photo = photo.Photo.objects.get(id=result["id"])
        result["metadata"], result["photoStr"] = cur_photo.get_thumbnail(req_user)

        if cur_photo in purchased:
            # Someone who has purchased a photo, should still be able to
            # download deleted photo
            result["owns"] = True
        else:
            result["owns"] = False
            if result["deleted"] == True:
                # Check if photo is deleted, if it is, remove from result list
                remove_photo.append(result)
            if req_user == str(cur_photo.get_user().get_id()):
                result["owns"] = True

    # Only return photos which have not been deleted
    album_photos = [i for i in res if i not in remove_photo]

    return album_photos


def catalogue_thumbnail(catalogue_obj, u_id):
    """
    Get the thumbnail of first photo (not deleted) from an album
    @param: catalogue_obj: Document.Catalogue
    @param: u_id: str
    return: {"thumbnail": str}
    """

    photos = catalogue_obj.get_photos()

    thumbnail = {"thumbnail": ""}

    for _photo in photos:
        if not _photo.is_deleted():
            # Get first image which has not been deleted
            metadata, photoStr = _photo.get_thumbnail(u_id)
            thumbnail["thumbnail"] = metadata + photoStr
            break

    return thumbnail
