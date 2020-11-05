'''
Photo Class for mongoengine
'''

import datetime
from mongoengine import StringField
from mongoengine import ListField
from mongoengine import DateTimeField
from mongoengine import IntField
from mongoengine import BooleanField
from mongoengine import Document
from mongoengine import ReferenceField
from lib.photo.fs_interactions import find_photo

# Used as part of 'collection.Collection'
import lib.user.user as user
import lib.album.album as album
import lib.comment.comment as comment
import lib.collection.collection as collection
import lib.photo.validation as validation


class Photo(Document):
    '''
    Photo definition and methods
    '''
    # Title of the photo
    title = StringField(required=True, validation=validation.validate_title)
    # Price of the photo
    price = IntField(required=True, validation=validation.validate_price)
    # List of Albums references that the photo is associated with
    albums = ListField(ReferenceField('album.Album'))
    # List of Collection references that the photo is associated with
    collections = ListField(ReferenceField('collection.Collection'))
    # List of Tags, updated to be unique on save
    tags = ListField(StringField(), validation=validation.validate_tags)
    # Metadata of the photo
    metadata = StringField()
    # Discounted price of the photo
    discount = IntField(default=0, validation=validation.validate_discount)
    # Posted date of the photo.
    posted = DateTimeField(default=datetime.datetime.now())
    # User reference to the owner of the photo
    user = ReferenceField('user.User')
    # Photo's extension
    extension = StringField(validation=validation.validate_extension)
    # Number of likes of the photo
    likes = IntField(default=0)
    # List of Comments associated with the photo
    #comments = ListField(ObjectIdField())
    comments = ListField(ReferenceField('comment.Comment'))
    # Whether the photo is deleted or not
    deleted = BooleanField(default=False)
    # Metadata of the photo {collection: collection-name}
    meta = {'collection': 'photos-mongoengine'}

    def get_id(self):
        '''
        Object id of the photo
        '''
        return self.id

    def add_tags(self, tags):
        '''
        Add a list of tags
        @params tags: list
        '''
        # Ensure unique
        self.tags = set(tags).union(set(self.tags))

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

    def set_title(self, title):
        '''
        Set the Photo title
        '''
        self.title = title

    def get_title(self):
        '''
        Get the title of the photo
        '''
        return self.title

    def set_price(self, price):
        '''
        Set the price of the photo
        '''
        self.price = price

    def get_price(self):
        '''
        Get the price of the photo. Ignore the discount.
        '''
        return self.price

    def get_albums(self):
        '''
        Return the list of albums
        '''
        albums = []
        for this_album in self.albums:
            if not this_album.is_deleted():
                albums.append(this_album)
        return albums

    def add_album(self, this_album):
        '''
        Add an album reference
        '''
        self.albums.append(this_album)

    def remove_album(self, this_album):
        '''
        Remove an album reference
        '''
        self.albums.remove(this_album)

    def set_discount(self, discount):
        '''
        Set a discount on the photo
        '''
        self.discount = discount

    def get_posted(self):
        '''
        Return the posted date
        '''
        return self.posted

    def get_metadata(self):
        '''
        Get the metadata of the photo
        e.g. "data:image/png;base64,"
        '''
        return self.metadata

    def set_metadata(self, metadata):
        '''
        Set the metadata of the photo
        '''
        self.metadata = metadata

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
        return int(self.price - self.price * (self.discount/100))

    def get_user(self):
        '''
        Get the creator of the photo
        '''
        return self.user

    def set_user(self, this_user):
        '''
        Set the owner of the photo
        @param user: User: mongoengine.Document
        '''
        self.user = this_user

    def increment_likes(self):
        '''
        Increase the likes by one
        Increase the likes of the user by one
        Save the user object
        '''
        self.likes += 1

    def decrement_likes(self):
        '''
        Decrement likes by one unless likes == 0
        Decrease the likes of the user by one
        Save the user object
        '''
        self.likes -= 1

    def reset_likes(self):
        '''
        Reset likes to 0
        '''
        self.likes = 0

    def get_likes(self):
        '''
        Get number of likes for the photo
        '''
        return self.likes

    def add_comment(self, this_comment):
        '''
        Add a single comment to the photo
        @param comment: string
        '''
        #Param should be ObjectId
        self.comments.append(this_comment)

    def get_comments(self):
        '''
        Get all the comments
        '''
        return self.comments

    def remove_collection(self, old_collection):
        '''
        Remove a collection from this photo's references
        '''
        if self in old_collection.photos:
            old_collection.photos.remove(self)
            old_collection.save()
        if old_collection in self.collections:
            self.collections.remove(old_collection)

    def delete_photo(self):
        '''
        Delete the photo by setting the deleted flag to False
        '''
        self.deleted = True
        for this_collection in self.collections:
            this_collection.remove_photo(self)
            this_collection.save()

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

    def get_extension(self):
        '''
        Get the collection objects
        '''
        return self.extension

    def get_thumbnail(self, u_id):
        '''
        Get the watermarked or non watermarked photo based on
        whether the u_id passed in owns the photo
        '''

        # SVG thumbnails are in png format
        this_extension = self.get_extension()
        if this_extension == ".svg":
            this_extension = ".png"

        try:
            this_user = user.User.objects.get(id=u_id)
            if self in this_user.get_purchased() or this_user == self.get_user():
                return find_photo(f"{self.get_id()}_t{this_extension}")
            return find_photo(f"{self.get_id()}_t_w{this_extension}")
        except:
            return find_photo(f"{self.get_id()}_t_w{this_extension}")


    def is_photo_owner(self, this_user):
        '''
        Check if the user is the owner of the photo
        @return boolean
        '''
        return this_user is self.get_user()

    def get_photo_json(self):
        '''
        Return object as JSON
        Any reference fields are returned as object ids
        '''
        return {
                'title': self.get_title(),
                'price': self.get_price(),
                'albums': [album.id for album in self.get_albums()],
                'collection': [coll.id for coll in self.get_collections()],
                'tags': self.get_tags(),
                'metadata': self.get_metadata(),
                'discount': self.get_discount(),
                'posted': self.get_posted(),
                'user': self.get_user().id,
                'extension': self.get_extension(),
                'likes': self.get_likes(),
                'comments': [comment.id for comment in self.get_comments()],
                'deleted': self.is_deleted(),
                }

    def clean(self):
        '''
        Methods called as part of save()
        1) Ensure that the tags are unique
        '''
        if list(set(self.tags)) is not self.tags:
            self.tags = list(set(self.tags))
