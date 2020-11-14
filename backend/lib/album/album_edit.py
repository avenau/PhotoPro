"""
Create and modify albums which are uploaded by a user

"""
import datetime
import mongoengine
import traceback
import lib.Error as Error
import lib.album


def create_album(title, user):
    """
    Create a new album for a user
    @param title(str): title of album
    @param user: user object
    return: str(albumid) of created album
    """

    album = lib.album.album.Album(
        title=title,
        creation_date=datetime.datetime.now(),
        created_by=user,
    )
    try:
        album.save()
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError

    user.add_album(album)
    user.save()

    return {"albumId": str(album.get_id())}


def get_albums(user):
    """
    Get albums of a user
    @param user: user object
    return: 2D array of albums. Inner array: [albumId: albumTitle]
    """
    albums = user.get_albums()

    # Find the titles of the albums and place in dictionary
    # [[albumid: title, albumid], [title2: albumid]:...]
    albumList = list()
    for i in albums:
        albumList.append((str(i.get_id()), i.get_title()))

    return {"albumList": albumList}
