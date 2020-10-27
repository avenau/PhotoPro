'''
Collection related methods
'''

import datetime
from mongoengine import StringField
from mongoengine import ListField
from mongoengine import ReferenceField
from mongoengine import DateTimeField
from mongoengine import BooleanField
from mongoengine import Document
from mongoengine import connect
from mongoengine.queryset import queryset_manager
from photo import Photo


class Collection(Document):
    '''
    Collection made up of a title, photos and a creation date
    '''
    title = StringField(required=True, max_length=200)
    photos = ListField(ReferenceField(Photo))
    creation_date = DateTimeField(default=datetime.datetime.now())
    # created_by = ReferenceField(User)
    private = BooleanField()
    tags = ListField(StringField())
    price = 0

    def update_title(self, new_title):
        '''
        Update the title of the image
        '''
        self.title = new_title
        self.save()

    def update_tags(self):
        '''
        Create a unique set of all tags in all photos
        '''
        tags = set(self.tags)
        for photo in self.photos:
            for tag in photo.tags:
                tags.add(tag)
        self.save()

    def add_photos(self, photos):
        '''
        Add a list of photos
        @param photos: list of photo references
        '''
        for photo in photos:
            self.photos.append(photo)
        self.update_tags()
        self.update_price()
        self.save()

    def remove_photos(self, photos):
        '''
        Remove a list of photos
        '''
        for photo in photos:
            self.photos.remove(photo)
        self.update_tags()
        self.update_price()
        self.save()

    def update_price(self):
        '''
        Iterate through the photos and update the price
        '''
        price = 0
        for photo in self.photos:
            price += photo.price
        self.price = price
        self.save()

    def set_private(self):
        '''
        Set the collection to private
        '''
        self.private = True
        self.save()

    def set_public(self):
        '''
        Set the collection to public
        '''
        self.private = False
        self.save()

    @queryset_manager
    def get_deleted_photos(self, queryset):
        '''
        Get all the photos that have been deleted
        '''
        return queryset.filter(deleted=True)


def test_collection():
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
    # Connect to the database
    connect('angular-flask-muckaround')

    # Create a Photo
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

    # Create a second photo
    photo_two = Photo(
        title='Photo Two',
        price=20,
        tags=['dog', 'bird'],
        discount=0,
        posted=datetime.datetime.now(),
        likes=2,
        comments=['This photo sucks'],
        deleted=False,
        pathToImg='./backend/thisSecondPhoto.jpg'
    )

    # Photo MUST be saved to the database to be referenced
    photo_one.save()
    photo_two.save()

    # Create a Collection
    my_collection = Collection(
        title='My Collection',
        photos=[photo_one]
    )
    my_collection.save()
    my_collection.update_title('New Title')
    my_collection.add_photos([photo_two])


if __name__ == '__main__':
    test_collection()
