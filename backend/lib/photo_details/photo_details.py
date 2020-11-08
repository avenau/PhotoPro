'''
Photo Details
'''
from bson.errors import InvalidId
from bson.objectid import ObjectId
import lib.Error
from json import dumps
from lib.photo.photo import Photo
from lib.user.user import User
from lib import token_functions
# Modified from profile_details
    
def photo_detail_results(photo_id, token):
    print("Photo details results")
    try:
        req_user = token_functions.get_uid(token)
    except:
        # Not signed in
        req_user = ""
    try:
        this_photo = Photo.objects.get(id=photo_id)
    except Photo.DoesNotExist:
        raise Error.PhotoDNE("Photo with ID: " + photo_id + " couldn't be found.")
        
    print("##################")
    print(req_user)
    print("##################")
    # If signed in
    if req_user != "":
        this_user = User.objects.get(id=req_user)
        purchased = this_photo in this_user.get_purchased()
        print(this_photo.get_user())
        print(this_user)
        is_artist = this_photo.get_user() == this_user
    else:
        purchased = False
        is_artist = False

    # if purchased == False and is_artist == False and this_photo.is_deleted() == True:
    #     return dumps(
    #         {
    #             "u_id": "",
    #             "title": "",
    #             "likes": "",
    #             "tagsList": "",
    #             "nickname": "",
    #             "email": "",
    #             "purchased": False,
    #             "metadata": "",
    #             "price": "",
    #             "discount": "",
    #             "deleted": this_photo.is_deleted(),
    #             "photoStr": "",
    #             "status": 1,
    #             "is_artist": is_artist,
    #         }
    #     )

    return dumps(
        {
            "u_id": str(this_photo.get_user().get_id()),
            "title": this_photo.get_title(),
            "likes": this_photo.get_likes(),
            "tagsList": this_photo.get_tags(),
            "nickname": this_photo.get_user().get_nickname(),
            "email": this_photo.get_user().get_email(),
            "purchased": purchased,
            "metadata": this_photo.get_metadata(),
            "price": this_photo.get_price(),
            "discount": this_photo.get_discount(),
            "deleted": this_photo.is_deleted(),
            "photoStr": this_photo.get_thumbnail(req_user),
            "is_artist": is_artist,
        }
    )
