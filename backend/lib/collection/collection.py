'''
Collection related methods
'''

import datetime
from mongoengine import StringField
from mongoengine import ListField
from mongoengine import ReferenceField
from mongoengine import DateTimeField
from mongoengine import BooleanField
from mongoengine import IntField
from mongoengine import Document
from mongoengine import connect
from photo import Photo


class Collection(Document):
    '''
    Collection made up of a title, photos and a creation date
    Collection {
        title: "Cool collection",
        photos: [Object1, Object2]
    }
    '''
    title = StringField(required=True, max_length=200)
    photos = ListField(ReferenceField(Photo, reverse_delete_rule=1))
    creation_date = DateTimeField(default=datetime.datetime.now())
    # created_by = ReferenceField(User)
    private = BooleanField(default=False, required=True)
    tags = ListField(StringField())
    price = IntField(default=0)

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
        self.tags = list(tags)
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
        @param photos: list of photo references
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
        deleted=True,
        pathToImg='./backend/thisSecondPhoto.jpg'
    )

    # Photo MUST be saved to the database to be referenced
    p_1 = Photo.objects(title=photo_one.title).first()
    if p_1 is None:
        photo_one.save()
        p_1 = photo_one
    p_2 = Photo.objects(title=photo_two.title).first()
    if p_2 is None:
        photo_two.save()
        p_2 = photo_two

    # Create a Collection
    my_collection = Collection(
        title='My Collection',
        photos=[p_1]
    )
    c_1 = Collection.objects(title=my_collection.title).first()
    if c_1 is None:
        my_collection.save()
        c_1 = my_collection

    # Update the title
    c_1.update_title('New Title')

    # Add some photos
    c_1.add_photos([p_2])


if __name__ == '__main__':
    test_collection()
