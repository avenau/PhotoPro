"""
Photo Details
"""
from bson.errors import InvalidId
from bson.objectid import ObjectId
from lib import Error
from json import dumps
from lib.photo.photo import Photo
from lib.user.user import User
from lib import token_functions
from lib.popular.popular_interactions import do_like, do_unlike
import traceback
from datetime import datetime, date, timedelta
import math


def photo_detail_results(photo_id, token):
    try:
        req_user = token_functions.get_uid(token)
    except:
        # Not signed in
        req_user = ""
    try:
        this_photo = Photo.objects.get(id=photo_id)
    except:
        raise Error.PhotoDNE("Photo with ID: " + photo_id + " couldn't be found.")

    if this_photo.is_deleted():
        raise Error.PhotoDNE("Photo " + photo_id + " has been deleted")
    # If signed in
    if req_user != "":
        this_user = User.objects.get(id=req_user)
        purchased = this_photo in this_user.get_purchased()
        is_artist = this_photo.get_user() == this_user
    else:
        purchased = False
        is_artist = False

    metadata, thumbnail_b64 = this_photo.get_thumbnail(req_user)
    details = {
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
        "metadata": metadata,
        "photoStr": thumbnail_b64,
        "deleted": this_photo.is_deleted(),
        "is_artist": is_artist,
        "comments": get_all_comments(photo_id, datetime.now(), "true"),
    }

    return dumps(details)


def get_all_comments(p_id, current_date, order):
    """
    Get all comments for a photo
    @param p_id: string(photo id)
    @return [
        commenter: User,
        datePosted: datetime,
        content: string,
        exact_time: string,
    ]
    """
    this_photo = Photo.objects.get(id=p_id)
    if not this_photo:
        print(traceback.format_exc)
        raise PhotoDNE("Could not find photo")
    comments = this_photo.get_comments()
    result = []

    def takeDate(elem):
        seconds = datetime.now() - elem.get_posted()
        return seconds.total_seconds()

    if order == "true":
        comments.sort(key=takeDate, reverse=False)
    else:
        comments.sort(key=takeDate, reverse=True)

    for comment in comments:
        years_ago = current_date.year - comment.get_posted().year
        months_ago = current_date.month - comment.get_posted().month
        days_ago = current_date.day - comment.get_posted().day
        hours_ago = current_date.hour - comment.get_posted().hour
        minutes_ago = current_date.minute - comment.get_posted().minute

        time_diff = current_date - comment.get_posted()
        time_diff_sec = time_diff.total_seconds()

        if time_diff_sec >= 31536000:
            year_diff = math.trunc(time_diff_sec / 31536000)
            time_after = str(year_diff) + " years ago"
        elif time_diff_sec >= 2592000:
            month_diff = math.trunc(time_diff_sec / 2592000)
            time_after = str(month_diff) + " months ago"
        elif time_diff_sec >= 86400:
            day_diff = math.trunc(time_diff_sec / 86400)
            time_after = str(day_diff) + " days ago"
        elif time_diff_sec >= 3600:
            hour_diff = math.trunc(time_diff_sec / 3600)
            time_after = str(hour_diff) + " hours ago"
        elif time_diff_sec >= 60:
            minute_diff = math.trunc(time_diff_sec / 60)
            time_after = str(minute_diff) + " minutes ago"
        else:
            time_after = "just now"

        comment_id = str(comment.get_id())

        result.append(
            dumps(
                {
                    "commenter": comment.get_commenter().get_nickname(),
                    "datePosted": str(comment.get_posted()),
                    "content": comment.get_content(),
                    "commenter_id": str(comment.get_commenter().get_id()),
                    "exact_time": comment.get_posted().strftime("%d/%b/%Y %H:%M"),
                    "time_after": time_after,
                    "comment_id": comment_id,
                    "profile_pic": comment.get_commenter().get_profile_pic(),
                }
            )
        )

    return result


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
        do_unlike(this_photo)
        return False
    # If not already liked, like the photo
    else:
        this_user.add_liked_photo(this_photo)
        this_user.save()
        this_photo.increment_likes()
        this_photo.save()
        # Change PopularPhoto db collection
        do_like(this_photo)
        return True
