"""
Collection related functions.
Mostly used on the frontend
@author Joe
"""
import traceback
import datetime
import mongoengine
import lib.collection.collection as collection
import lib.photo.photo as photo
import lib.Error as Error
import lib.user.user as user
from json import loads
from bson.json_util import dumps
from bson.objectid import ObjectId
from lib.collection.validation import validate_title
from lib.token_functions import get_uid

def get_collection(_collection):
    """
    Get the collection referred to by collection_id
    @param collection_id : mongoengine.Document.Collection
    @return{
        title: string,
        photos: [Photo],
        creation_date: datetime,
        private: boolean,
        price, int
        tags: [string],
    }
    """
    if not _collection:
        raise Error.ValueError("Collection not found")

    return _collection.get_collection_json()


def create_collection(_user, params):
    """
    @param _user: mongoengine.Document.User
    @param title: string
    @param discount: int
    @param tags: [string]
    @return collection_id: string
    """
    title = ''
    tags = []

    if not _user:
        raise Error.UserDNE("No user found")

    if "title" in params:
        title = params['title']
    if "tags" in params:
        tags = params['tags']

    # validate_title(title, _user)

    new_collection = collection.Collection(
        title=title,
        created_by=_user,
        tags=tags,
        creation_date=datetime.datetime.now(),
    )
    try:
        new_collection.save()
        _user.add_collection(new_collection)
        _user.save()
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError

    return {'title': new_collection.get_title(),
            'id': str(new_collection.get_id()),
            'tags': new_collection.get_tags(),
            'creation_date': str(new_collection.get_creation_date())}


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
    if _user != _collection.get_created_by():
        return ret

    try:
        _collection.delete()
        ret = True
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
    if _collection.get_created_by() != _user:
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

def update_collection(params, _collection):
    '''
    Update collection
    '''
    if 'title' in params:
        _collection.set_title(params['title'])
    if 'tags' in params:
        _collection.set_tags()
    if 'private' in params:
        if params['private'] == 'true':
            _collection.set_private()
        if params['private'] == 'false':
            _collection.set_public()
    _collection.save()

def get_user_price(_user, _collection):
    '''
    Get the price for the current user
    '''
    user_price = 0
    price_without_ownership = 0
    for _photo in _collection.get_photos():
        if _photo not in _user.get_purchased():
            user_price += _photo.get_discounted_price()
        price_without_ownership += _photo.get_discounted_price()

    return user_price, price_without_ownership


def get_all_collections(args):
    '''
    token: string
    photoId (optional): string
    '''
    token = args.get('token')
    photo_id = ''

    _user = user.User.objects.get(id=get_uid(token))
    if 'photoId' in args.keys():
        photo_id = args.get('photoId')
    res = loads(collection.Collection.objects(created_by=_user).to_json())

    # Add the id entry and the photoExists entries
    for entry in res:
        entry['id'] = entry['_id']['$oid']
        entry['photoExists'] = False
        print(entry)
        if 'photos' in entry:
            for this_photo in entry['photos']:
                print(this_photo['$oid'], photo_id)
                if this_photo['$oid'] == photo_id:
                    entry['photoExists'] = True
    return dumps(res)


def collection_photo_search(data):
    '''
    Get thumbnails of the photos in a collection
    '''
    try:
        req_user = get_uid(data["token"])
    except:
        req_user = ""
    try:
        _id = ObjectId(data["query"])
    except:
        _id = ""
    if 'offset' in data:
        offset = data['offset']
    else:
        offset = 0
    if 'limit' in data:
        limit = data['limit']
    else:
        limit = 5

    _collection = collection.Collection.objects.get(id=_id)
    _photos = _collection.get_photos()[offset:offset+limit]
    ret_photos = []
    for this_photo in _photos:
        meta, thumbnail = this_photo.get_thumbnail(req_user)
        ret_photos.append({
                'title': this_photo.get_title(),
                'price': this_photo.get_price(),
                'discount': this_photo.get_discount(),
                'photoStr': thumbnail,
                'metadata': meta,
                'id': str(this_photo.get_id())
            })
    return ret_photos
