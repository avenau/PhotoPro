'''
Photo Details
'''
from bson.errors import InvalidId
from bson.objectid import ObjectId
from lib.Error import TokenError
from json import dumps
import lib.photo.photo as photo
import lib.user.user as user
# Modified from profile_details


def get_photo_details(p_id, mongo):
    '''
    Get the Photo information from mongo
    @param p_id(string): The _id of the photo
    @param mongo(object): The photo collection in Mongo
    @return photo(object): The photo document straight from Mongo
    '''

    try:
        oid = ObjectId(p_id)
    except InvalidId:
        raise TokenError("p_id is not a valid ObjectId." + p_id)

    photo = mongo.db.photos.find_one({"_id": oid})
    if photo is None:
        print("Photos not found")
        # TODO: Add Photo Errors
        # raise UserDNE("User not found")
    return photo
    
def photo_detail_results(photo_id, token):
    try:
        req_user = token_functions.get_uid(token)
    except:
        req_user = ""
    try:
        _photo = photo.Photo.objects.get(id=photo_id)
    except photo.Photo.DoesNotExist:
        print("INVALID!!!!")
    user_purchasers = user.User.objects(purchased=_photo.id).count()
    purchased = user_purchasers > 0

    is_artist = str(_photo.get_user().get_id()) == req_user
    if purchased == False and is_artist == False and _photo.is_deleted() == True:
        return dumps(
            {
                "u_id": "",
                "title": "",
                "likes": "",
                "tagsList": "",
                "nickname": "",
                "email": "",
                "purchased": False,
                "metadata": "",
                "price": "",
                "discount": "",
                "deleted": _photo.is_deleted(),
                "photoStr": "",
                "status": 1,
                "is_artist": is_artist,
            }
        )

    return dumps(
        {
            "u_id": str(_photo.get_user().get_id()),
            "title": _photo.get_title(),
            "likes": _photo.get_likes(),
            "tagsList": _photo.get_tags(),
            "nickname": _photo.get_user().get_nickname(),
            "email": _photo.get_user().get_email(),
            "purchased": purchased,
            "metadata": _photo.get_metadata(),
            "price": _photo.get_price(),
            "discount": _photo.get_discount(),
            "deleted": _photo.is_deleted(),
            "photoStr": _photo.get_thumbnail(req_user),
            "status": 1,
            "is_artist": is_artist,
        }
    )
