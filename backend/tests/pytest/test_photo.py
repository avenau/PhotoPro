'''
Monogoengine photo related pytests
'''

import datetime

from mongoengine import connect
from mongoengine.connection import _get_db

# Local stuff
from lib.collection.collection import Collection
from lib.photo.photo import Photo

# Global test objects
# -------------------
DATABASE_NAME = 'angular-flask-muckaround'


# ------------------


def clean_database():
    '''
    Get rid of test junk from the database
    '''
    connect(DATABASE_NAME)
    # Delete the photos
    for photo in Photo.objects:
        photo.delete()

    # Delete the collections
    for collection in Collection.objects:
        collection.delete()

    # Drop the mongo collection
    database = _get_db()
    database.drop_collection('photos-mongoengine')
    database.drop_collection('collections-mongoengine')


def test_unique_tags():
    '''
    Test that the tags passed to the photo are all unique
    '''
    tags = ['dog', 'dog']
    connect(DATABASE_NAME)
    clean_database()
    test_photo = Photo(
        title='Duplicate Tags',
        price='20',
        tags=tags,
        discount=0,
        posted=datetime.datetime.now(),
        likes=1,
        comments=['Great photo', 'I love it'],
        deleted=False,
    )
    test_photo.save()

    assert list(test_photo.tags) != tags
    assert list(test_photo.tags) == list(set(tags))
    clean_database()


def test_add_photo():
    '''
    Test photo insertion
    '''
    photo_one = Photo(
        title='Photo One',
        price=50,
        tags=['dog', 'cat'],
        discount=0,
        posted=datetime.datetime.now(),
        likes=1,
        comments=['Great photo', 'I love it'],
        deleted=False,
    )
    photo_one.save()

    collection_one = Collection(
        title='Collection One',
        photos=[],
        creation_date=datetime.datetime.now(),
        private=False,
        tags=[]
    )
    collection_one.save()
    assert collection_one.photos == []
    collection_one.add_photo(photo_one)
    assert collection_one.photos[0] is photo_one
    clean_database()


def test_delete_photo():
    '''
    If a photo is deleted then it should be removed from the collection as well
    '''
    photo_one = Photo(
        title='Photo One',
        price=50,
        tags=['dog', 'cat'],
        discount=0,
        posted=datetime.datetime.now(),
        likes=1,
        comments=['Great photo', 'I love it'],
        deleted=False,
    )
    photo_one.save()

    collection_one = Collection(
        title='Collection One',
        photos=[],
        creation_date=datetime.datetime.now(),
        private=False,
        tags=[]
    )
    collection_one.save()
    collection_one.add_photo(photo_one)
    collection_one.save()
    assert collection_one.photos[0] is photo_one
    photo_one.delete_photo()
    assert photo_one.deleted is True
    assert collection_one.photos == []

    clean_database()


def test_clean_db():
    '''
    Make sure to clean up after yourself
    '''
    clean_database()
