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

# Photo One
photo_one = Photo(
    title='Photo One',
    price='50',
    tags=['dog', 'cat'],
    discount=0,
    posted=datetime.datetime.now(),
    likes=1,
    comments=['Great photo', 'I love it'],
    deleted=False,
    pathToImg='./backend/thisphoto.jpg'
)


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
        pathToImg='./backend/thisphoto.jpg'
    )
    test_photo.save()

    assert list(test_photo.tags) == tags
