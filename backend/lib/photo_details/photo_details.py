'''
Photo Details
'''
from bson.errors import InvalidId
from bson.objectid import ObjectId
from lib import Error
from json import dumps
from lib.photo.photo import Photo
from lib.user.user import User
from lib import token_functions
from lib.popular.popular_interactions import do_like, do_unlike
    
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
            "artist_id": str(this_photo.get_user().get_id()),
            "artist_nickname": this_photo.get_user().get_nickname(),
            "artist_email": this_photo.get_user().get_email(),
            "title": this_photo.get_title(),
            "price": this_photo.get_price(),
            "discount": this_photo.get_discount(),
            "posted": str(this_photo.get_posted())[:10],
            "n_likes": this_photo.get_likes(),
            "is_liked": is_photo_liked(this_photo, this_user) if req_user else False,
            "tagsList": this_photo.get_tags(),
            "purchased": purchased,
            "metadata": this_photo.get_metadata(),
            "photoStr": this_photo.get_thumbnail(req_user),
            "deleted": this_photo.is_deleted(),
            "is_artist": is_artist,
        }
    )

def is_photo_liked(this_photo, this_user):
    """
    Helper to checks if this_photo has been liked by this_user and returns bool
    """
    return this_photo in this_user.get_liked()


def like_photo(u_id, photo_id):
    """
    Toggle like on a photo
    If photo is already liked, unlike it
    If photo is not liked, like it
    """ 
    if u_id == "":
        return False

    this_user = User.objects.get(id=u_id)

    try:
        this_photo = Photo.objects.get(id=photo_id)
    except:
        raise Error.PhotoDNE("Couldnt find db entry for photo: " + photo_id)

    # If already liked, remove the like from the photo
    if this_photo in this_user.get_liked():
        this_user.remove_liked_photo(this_photo)
        this_user.save()
        this_photo.decrement_likes()
        this_photo.save()
        # Change PopularPhoto db collection
        do_unlike(this_user, this_photo)
        print("unlike")
        return False
    # If not already liked, like the photo
    else:
        this_user.add_liked_photo(this_photo)
        this_user.save()
        this_photo.increment_likes()
        this_photo.save()
        # Change PopularPhoto db collection
        do_like(this_user, this_photo)
        print("like")
        return True