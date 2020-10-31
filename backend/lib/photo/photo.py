'''
Dummy Photo class and methods
'''

import datetime
from mongoengine import StringField
from mongoengine import ListField
from mongoengine import DateTimeField
from mongoengine import IntField
from mongoengine import BooleanField
from mongoengine import Document
from mongoengine import ReferenceField

# Used as part of 'collection.Collection'
import lib.collection.collection as collection


class Photo(Document):
    '''
    Dummy photo class for testing jajaccollection.Collection
    '''
    title = StringField()
    price = IntField()
    # albums = ListField()
    # Collections that this photo is a part of
    collections = ListField(ReferenceField('collection.Collection'))
    tags = ListField(StringField())
    discount = IntField(default=0)
    posted = DateTimeField(default=datetime.datetime.now())
    # user = ReferenceField()
    likes = IntField()
    comments = ListField(StringField())
    deleted = BooleanField(default=False)
    path = StringField()
    # Name of the collection
    meta = {'collection': 'photos-mongoengine'}

    def add_tags(self, tags):
        '''
        Add a list of tags
        @params tags: list
        '''
        # Ensure unique
        self.tags = set(tags).union(set(self.tags))
        self.save()

    def add_tag(self, tag):
        '''
        Add an individual tag
        '''
        self.tags = set(self.tags).add(tag)

    def get_tags(self):
        '''
        Tags getter
        @return tags: list
        '''
        return self.tags

    def update_tags(self):
        '''
        Ensure that all tags are unique
        '''
        self.tags = set(self.tags)
        self.save()

    def set_title(self, title):
        '''
        Set the Photo title
        '''
        self.title = title
        self.save()

    def get_title(self):
        '''
        Get the title of the photo
        '''
        return self.title

    def set_price(self, price):
        '''
        Set the price of the photo
        '''
        if not isinstance(price, int):
            raise ValueError("Price must be an integer")
        self.price = price
        self.save()

    def get_price(self):
        '''
        Get the price of the photo. Ignore the discount.
        '''
        return self.price

    def set_discount(self, discount):
        '''
        Set a discount on the photo
        '''
        if not isinstance(discount, int):
            raise ValueError("Discount must be of type integer")
        if discount < 0:
            raise ValueError("Discount must be greater than 0")
        if discount > 100:
            raise ValueError("Discount must be less than 100")
        self.discount = discount
        self.save()

    def get_discount(self):
        '''
        Get the discount percentage of the photo
        '''
        return self.discount

    def get_discounted_price(self):
        '''
        Get the discounted price of the photo
        @return price : integer
        '''
        return int(self.price * (self.discount/100))

    def set_posted_date(self, date):
        '''
        Set the datetime of the post of the photo
        '''
        if not isinstance(date, datetime.datetime):
            raise ValueError("date must be of type datetime")
        self.posted = date
        self.save()

    def set_likes(self, n_likes):
        '''
        Set likes to the required number of likes
        '''
        self.likes = n_likes
        self.save()

    def increment_likes(self):
        '''
        Increase the likes by one
        '''
        self.likes += 1
        self.save()

    def decrement_likes(self):
        '''
        Decrement likes by one unless likes == 0
        '''
        if self.likes == 0:
            return
        self.likes -= 1
        self.save()

    def reset_likes(self):
        '''
        Reset likes to 0
        '''
        self.likes = 0
        self.save()

    def get_likes(self):
        '''
        Get number of likes for the photo
        '''
        return self.likes

    def add_comments(self, comments):
        '''
        Add a list of comments
        @param comments: string[]
        '''
        if not isinstance(comments, list):
            raise ValueError("Comments must be a list of strings")
        if not comments:
            return
        if not isinstance(comments[0], str):
            raise ValueError("Comment is not of type string")
        self.comments.extend(comments)
        self.save()

    def add_comment(self, comment):
        '''
        Add a single comment to the photo
        @param comment: string
        '''
        if not isinstance(comment, str):
            raise ValueError("Comment must be of type string")
        self.comments.append(comment)
        self.save()

    def get_comments(self):
        '''
        Get all the comments
        '''
        if not self.comments:
            return []
        return self.comments[0]

    def remove_collection(self, old_collection):
        '''
        Remove a collection from this photo's references
        '''
        if self in old_collection.photos:
            old_collection.photos.remove(self)
            old_collection.save()
        if old_collection in self.collections:
            self.collections.remove(old_collection)
            self.save()

    def delete_photo(self):
        '''
        Delete the photo by setting the deleted flag to False
        '''
        self.deleted = True
        for this_collection in self.collections:
            this_collection.remove_photo(self)
            this_collection.save()
        self.save()

    def undelete_photo(self):
        '''
        Restore the photo but not to the albums and collections
        WARNING: Not sure of the longterm ramifications of this
        '''
        self.deleted = False

    def is_deleted(self):
        '''
        Determine whether the photo is deleted or not
        @return True on deleted, False otherwise
        '''
        return self.deleted

    def set_path(self, path):
        '''
        Set the path of the image
        '''
        if not isinstance(path, str):
            raise ValueError("Path must be of type string")
        self.path = path

    def get_path(self):
        '''
        Get the path of the image
        @return string
        '''
        return self.path

    def add_collection(self, new_collection):
        '''
        Add a collection to the photo's list of collections
        @param collection : lib.collection.jajaccollection.Collection
        '''
        self.collections.append(new_collection)

    def get_collections(self):
        '''
        Get the collection objects
        '''
        return self.collections

    def clean(self):
        '''
        Methods called as part of save()
        1) Ensure that the tags are unique
        '''
        if list(set(self.tags)) is not self.tags:
            self.tags = list(set(self.tags))
