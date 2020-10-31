from mongoengine import connect
from mongoengine.connection import _get_db
import bcrypt

# Local stuff
from lib.collection.collection import Collection
from lib.photo.photo import Photo
from lib.user.user import User

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
