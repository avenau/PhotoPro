'''
User mongoengine.Document pytests
'''

import bcrypt
import mongoengine
import pytest
from mongoengine import connect
from mongoengine.connection import _get_db

# Local stuff
from lib.collection.collection import Collection
from lib.photo.photo import Photo
from lib.user.user import User
import lib.Error as Error
import lib.search.search as search

from PIL import Image, ImageSequence

# Global test objects
# -------------------
DATABASE_NAME = 'angular-flask-muckaround'
# -------------------


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

    # Delete the users
    for user in User.objects:
        user.delete()

    # Drop the mongo collection
    database = _get_db()
    database.drop_collection('photos-mongoengine')
    database.drop_collection('collections-mongoengine')
    database.drop_collection('users')


def create_users():
    '''
    General user creation
    '''
    clean_database()
    connect(DATABASE_NAME)
    password = b"super secret password"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)

    my_user1 = User(
        fname="Joe",
        lname="Aczel",
        email="j.aczel@student.unsw.edu.au",
        nickname="Jaczel",
        # Assumes a Binary String will be passed
        password=hashed
    )
    my_user1.validate()
    my_user1.save()

    my_user2 = User(
        fname="Joe",
        lname="Aczel",
        email="j.aczel@student.unsw.edu.au2",
        nickname="Jaczel",
        # Assumes a Binary String will be passed
        password=hashed
    )
    my_user2.validate()
    my_user2.save()

    my_user3 = User(
        fname="Joe",
        lname="Aczel",
        email="j.aczel@student.unsw.edu.au3",
        nickname="Jaczel",
        # Assumes a Binary String will be passed
        password=hashed
    )
    my_user3.validate()
    my_user3.save()


def test_search_users():
  connect(DATABASE_NAME)
  clean_database()
  create_users()
  data = {
    "query": "joe",
    "limit": 2,
    "offset": 0
  }
  print(search.user_search(data))
  data2 = {
    "query": "joseph",
    "limit": 2,
    "offset": 0
  }
  print(search.user_search(data2))
