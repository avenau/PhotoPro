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
    database.drop_collection('users-mongoengine')


def test_user_creation():
    '''
    General user creation
    '''
    clean_database()
    connect(DATABASE_NAME)
    password = b"super secret password"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)

    my_user = User(
        fname="Joe",
        lname="Aczel",
        email="j.aczel@student.unsw.edu.au",
        nickname="Jaczel",
        # Assumes a Binary String will be passed
        password=hashed
    )
    my_user.validate()
    my_user.save()
    assert User.objects[0].fname == my_user.fname
    assert User.objects[0].lname == my_user.lname
    assert User.objects[0].email == my_user.email
    assert User.objects[0].nickname == my_user.nickname
    assert User.objects[0].password == my_user.password == hashed


def test_user_password():
    '''
    Create a hashed password and test against user password methods
    '''
    clean_database()
    password = b"super secret password"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    my_user = User(
        fname="Bob",
        lname="Jane",
        email="bjanetmart@gmail.com",
        nickname="TmartKing",
        password=hashed
    )
    my_user.save()
    assert my_user.is_matching_password(hashed) is True
    assert my_user.is_matching_password(password) is False
    with pytest.raises(ValueError):
        my_user.is_matching_password("regular string")


def test_user_extension_validation():
    '''
    Test that the extension is validated as a string and of the right type
    '''
    clean_database()
    password = b"super secret password"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    my_user = User(
        fname="Bob",
        lname="Jane",
        email="bjanetmart@gmail.com",
        nickname="TmartKing",
        password=hashed,
        extension='.jpg'
    )
    my_user.save()
    other_user = User(
        fname="Bob2",
        lname="Jane2",
        email="bjanetmart2@gmail.com",
        nickname="TmartKing",
        password=hashed,
        extension=1
    )
    with pytest.raises(mongoengine.ValidationError):
        other_user.save()
    other_user.set_extension('.svg')
    other_user.save()
    other_user.set_extension('.blahblahblah')
    with pytest.raises(Error.ValueError):
        other_user.save()


def test_user_credits():
    '''
    User credit validation checks
    '''
    clean_database()
    password = b"super secret password"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    my_user = User(
        fname="Bob",
        lname="Jane",
        email="bjanetmart@gmail.com",
        nickname="TmartKing",
        password=hashed,
        extension='.jpg',
        credits=50
    )
    my_user.save()
    my_user.remove_credits(50)
    my_user.save()
    my_user.remove_credits(1)
    with pytest.raises(Error.ValidationError):
        my_user.save()
    my_user.add_credits(1)
    my_user.save()
    with pytest.raises(Error.ValueError):
        my_user.add_credits('hello')


def test_user_photo_removal():
    '''
    Create a photo and then delete it
    It should no longer be in the user's photos
    '''
    clean_database()
    password = b"super secret password"
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    my_user = User(
        fname="Bob",
        lname="Jane",
        email="bjanetmart@gmail.com",
        nickname="TmartKing",
        password=hashed,
        extension='.jpg',
        credits=50
    )
    my_user.save()
    my_photo = Photo(
        title='New Photo',
        price=50,
        user=my_user
    )
    my_photo.save()
    # Attach photo to the user
    my_user.add_post(my_photo)
    assert my_user.get_posts() == [my_photo]
    my_photo.delete_photo()
    assert my_photo.is_deleted() is True
    assert my_user.get_posts() == []
