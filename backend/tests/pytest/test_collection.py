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

# Photo Two
photo_two = Photo(
    title='Photo Two',
    price=20,
    tags=['dog', 'bird'],
    discount=0,
    posted=datetime.datetime.now(),
    likes=2,
    comments=['This photo sucks'],
    deleted=True,
    pathToImg='./backend/thisSecondPhoto.jpg'
)

# Collection
my_collection = Collection(
    title='My Collection',
    photos=[]
)
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

    my_collection.update_title('New Title')
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

    # Photo MUST be saved to the database to be referenced
    photo_one.save()
    photo_two.save()

    # Create a Collection
    my_collection.save()

    # Add some photos
    my_collection.add_photos([photo_one, photo_two])
    assert len(my_collection.photos) == len([photo_one, photo_two])
    queried_collection = Collection.objects.first()
    assert len(queried_collection.photos) == len([photo_one, photo_two])


def test_clean_db():
    '''
    Clean up after yourself Pytest!
    '''
    clean_database()
