'''
Testing methods for collection
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

    # Drop the mongo collection
    database = _get_db()
    database.drop_collection('photos-mongoengine')
    database.drop_collection('collections-mongoengine')


def test_basic_insert():
    '''
    A basic pytest insert
    '''
    clean_database()
    connect(DATABASE_NAME)
    my_collection = Collection(
        title='My Collection',
        photos=[]
    )
    my_collection.save()
    assert Collection.objects.count() == 1


def test_updating_title():
    '''
    Add a title
    '''
    # Clean the database
    clean_database()

    # Connect to the database
    connect(DATABASE_NAME)

    my_collection = Collection(
        title='My Collection',
        photos=[]
    )

    my_collection.update_title('New Title')
    my_collection.save()
    assert Collection.objects(title='New Title')
    assert Collection.objects.count() == 1


def test_adding_photos():
    '''
    Test:
    1) Connect to the db
    2) Create a Photo
    3) Save the Photo
    4) Create a Collection
    5) Save the Collection
    6) Update the Collection title
    7) Save the Collection title
    '''

    clean_database()

    photo_one = Photo(
        title='Photo One',
        price='50',
        tags=['dog', 'cat'],
        discount=0,
        posted=datetime.datetime.now(),
        likes=1,
        comments=['Great photo', 'I love it'],
        deleted=False,
    )
    photo_one.save()

    photo_two = Photo(
        title='Photo Two',
        price=20,
        tags=['dog', 'bird'],
        discount=0,
        posted=datetime.datetime.now(),
        likes=2,
        comments=['This photo sucks'],
        deleted=True,
    )
    photo_two.save()

    # Create a Collection
    my_collection = Collection(
        title='My Collection',
        photos=[]
    )
    my_collection.save()

    # Add some photos
    my_collection.add_photos([photo_one, photo_two])
    my_collection.save()
    assert len(my_collection.photos) == len([photo_one, photo_two])
    queried_collection = Collection.objects.first()
    assert len(queried_collection.photos) == len([photo_one, photo_two])


def test_deleting_photo():
    '''
    Add a photo and then delete it, removing it from the collection
    '''

    clean_database()

    photo_one = Photo(
        title='Photo One',
        price='50',
        tags=['dog', 'cat'],
        discount=0,
        posted=datetime.datetime.now(),
        likes=1,
        comments=['Great photo', 'I love it'],
        deleted=False,
    )

    photo_one.save()

    my_collection = Collection(
        title='My Collection',
        photos=[]
    )

    # Check it's empty
    my_collection.save()
    assert my_collection.photos == []

    # Add a photo and check it exists
    my_collection.add_photo(photo_one)
    my_collection.save()
    assert my_collection.photos[0] == photo_one
    assert len(my_collection.photos) == 1

    # Delete a photo and check it's gone
    photo_one.delete_photo()
    assert photo_one.deleted is True
    assert my_collection.photos == []


def test_deleting_collection():
    '''
    Add a photo to a collection and then soft delete the collection
    '''
    photo_one = Photo(
        title='Photo One',
        price='50',
        tags=['dog', 'cat'],
        discount=0,
        posted=datetime.datetime.now(),
        likes=1,
        comments=['Great photo', 'I love it'],
        deleted=False,
    )
    photo_one.save()

    my_collection = Collection(
        title='My Collection',
        photos=[]
    )
    my_collection.save()

    my_collection.add_photo(photo_one)
    my_collection.save()
    assert my_collection.get_photos() == [photo_one]
    assert photo_one.get_collections() == [my_collection]
    assert my_collection.is_deleted() is False
    assert photo_one.is_deleted() is False

    my_collection.delete_collection()
    assert my_collection.get_photos() == []
    assert photo_one.get_collections() == []
    assert my_collection.is_deleted() is True
    assert photo_one.is_deleted() is False


def test_clean_db():
    '''
    Clean up after yourself Pytest!
    '''
    clean_database()
