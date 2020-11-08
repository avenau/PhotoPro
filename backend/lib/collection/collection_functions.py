"""
Collection related functions.
Mostly used on the frontend
@author Joe
"""
import traceback
import datetime
import mongoengine
import lib.collection.collection as collection
import lib.Error as Error


def get_collection(_collection):
    """
    Get the collection referred to by collection_id
    @param collection_id : mongoengine.Document.Collection
    @return{
        title: string,
        photos: [Photo],
        creation_date: datetime,
        deleted: boolean,
        private: boolean,
        price, int
        tags: [string],
    }
    """
    if not _collection:
        raise Error.ValueError("Collection not found")

    return _collection.get_collection_json()


def create_collection(_user, title, discount, tags):
    """
    @param _user: mongoengine.Document.User
    @param title: string
    @param discount: int
    @param tags: [string]
    @return collection_id: string
    """
    collection_id = ""
    if not _user:
        raise Error.UserDNE("No user found")

    new_collection = collection.Collection(
        title=title,
        created_by=_user,
        discount=discount,
        tags=tags,
        creation_date=datetime.datetime.now(),
    )
    try:
        new_collection.save()
        collection_id = str(new_collection.id)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError

    return collection_id


def delete_collection(_user, _collection):
    """
    @param _user: mongoengine.Document.User
    @param _collection: mongoengine.Document.Collection
    @return boolean
    """
    ret = False
    if not _user:
        raise Error.UserDNE("User does not exist")
    if not _collection:
        raise Error.AccessError("Collection does not exist")
    if _user is not _collection.get_created_by():
        return ret

    try:
        _collection.delete()
        return ret
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not delete collection")

    return ret


def get_collection_photos(_user, _collection):
    """
    @param _user : mongoengine.Document.User
    @param _collection : mongoengine.Document.Collection
    @return [mongoengine.Document.Photo]
    """
    if not _user:
        raise Error.UserDNE("User does not exist")
    if not _collection:
        raise Error.AccessError("Collection does not exist")
    if _user is not _collection.get_created_by():
        return []

    photos = []
    for _photo in _collection.get_photos():
        photos.append(_photo.get_thumbnail(str(_user.id)))
    return photos


def add_collection_photo(_user, _photo, _collection):
    """
    @param _user : mongoengine.Document.User
    @param _photo: mongoengin.Document.Photo
    @param _collection : mongoengine.Document.Collection
    @return boolean
    """
    if not _user:
        raise Error.UserDNE("User does not exist")
    if not _collection:
        raise Error.AccessError("Collection does not exist")
    if not _photo:
        raise Error.PhotoDNE("Photo does not exist")
    if _collection.get_user() != _user:
        raise PermissionError("User does not own collection")

    try:
        _collection.add_photo(_photo)
        _collection.save()
        _photo.add_collection(_collection)
        _photo.save()
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not update Collection and Photo")

    return True


def remove_collection_photo(_user, _photo, _collection):
    """
    @param _user : mongoengine.Document.User
    @param _photo: mongoengin.Document.Photo
    @param _collection : mongoengine.Document.Collection
    @return boolean
    """
    if not _user:
        raise Error.UserDNE("User does not exist")
    if not _collection:
        raise Error.AccessError("Collection does not exist")
    if not _photo:
        raise Error.PhotoDNE("Photo does not exist")
    if _collection.get_user() != _user:
        raise PermissionError("User does not own collection")

    try:
        _collection.remove_photo(_photo)
        _collection.save()
        _photo.remove_collection(_collection)
        _photo.save()
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not update Collection and Photo")

    return True
