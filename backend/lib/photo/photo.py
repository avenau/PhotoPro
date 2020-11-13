"""
Photo Class for mongoengine
"""

import datetime
import math
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
    """
    Photo definition and methods
    title: string
    price: int
    albums: [Album]
    collections: [Collection]
    tags: [string]
    metadata: string
    discount: int
    posted: datetime
    user: User
    likes: int
    comments: [Comment]
    deleted: boolean
    """
    # Title of the photo
    title = StringField(required=True, validation=validation.validate_title)
    # Price of the photo
    price = IntField(required=True, validation=validation.validate_price)
    # List of Albums references that the photo is associated with
    albums = ListField(ReferenceField("album.Album"), validation=validation.validate_albums)
    # List of Collection references that the photo is associated with
    collections = ListField(ReferenceField("collection.Collection"),
                            validation=validation.validate_collections)
    # List of Tags, updated to be unique on save
    tags = ListField(StringField(), validation=validation.validate_tags)
    # Metadata of the photo
    metadata = StringField(validation=validation.validate_metadata)
    # Discounted price of the photo
    discount = IntField(default=0, validation=validation.validate_discount)
    # Posted date of the photo.
    posted = DateTimeField(required=True, validation=validation.validate_posted)
    # User reference to the owner of the photo
    user = ReferenceField("user.User", validation=validation.validate_user)
    # Photo's extension
    extension = StringField(validation=validation.validate_extension)
    # Number of likes of the photo
    likes = IntField(default=0, validation=validation.validate_likes)
    # List of Comments associated with the photo
    # comments = ListField(ObjectIdField())
    comments = ListField(ReferenceField("comment.Comment"),
                         validation=validation.validate_comments)
    # Whether the photo is deleted or not
    deleted = BooleanField(default=False, validation=validation.validate_deleted)
    # Metadata of the photo {collection: collection-name}
    meta = {"collection": "photos"}

    def get_id(self):
        """
        Object id of the photo
        """
        return self.id

    def add_tags(self, tags):
        """
        Add a list of tags
        @params tags: list
        """
        # Ensure unique
        self.tags = set(tags).union(set(self.tags))
        self.update_tags()

    def add_tag(self, tag):
        """
        Add an individual tag
        """
        self.tags = set(self.tags).add(tag.lower())
        self.update_tags()

    def get_tags(self):
        """
        Tags getter
        @return tags: list
        """
        return self.tags

    def update_tags(self):
        """
        Ensure that all tags are unique
        """
        tags = []
        for tag in self.tags:
            tags.append(tag.lower())
        self.tags = set(tags)

    def set_title(self, title):
        """
        Set the Photo title
        """
        self.title = title

    def get_title(self):
        """
        Get the title of the photo
        """
        return self.title

    def set_price(self, price):
        """
        Set the price of the photo
        """
        self.price = price

    def get_price(self):
        """
        Get the price of the photo. Ignore the discount.
        """
        return self.price

    def add_album(self, new_album):
        """
        Add album to photo albums list
        """
        self.albums.append(new_album)

    def set_albums(self, albums):
        """
        Given a list of album ids(str).
        - Reset the corresponding list of albums objects from the photo
        - Remove photo from album if not selected
        """

        # Albums needed to remove; any album no longer appearing as selected
        remove = [alb_rm for alb_rm in self.albums if str(alb_rm.id) not in albums]
        for alb_rm in remove:
            alb_rm.remove_photo(self)
            alb_rm.save()

        # Update list of albums for current photo
        # Add photo to albums in list
        album_replace = []
        for _id in albums:
            album_obj = album.Album.objects.get(id=_id)
            album_replace.append(album_obj)
            if self not in album_obj.photos:
                # Add photo to Album document
                album_obj.add_photo(self)
                album_obj.save()

        self.albums = album_replace
        self.save()

    def get_albums(self):
        """
        Get the list of albums (album id) of the photo
        """
        return self.albums

    def remove_album(self, this_album):
        """
        Remove an album reference
        """
        self.albums.remove(this_album)

    def set_discount(self, discount):
        """
        Set a discount on the photo
        """
        self.discount = discount

    def get_posted(self):
        """
        Return the posted date
        """
        return self.posted

    def get_metadata(self):
        """
        Get the metadata of the photo
        e.g. "data:image/png;base64,"
        """
        return self.metadata

    def set_metadata(self, metadata):
        """
        Set the metadata of the photo
        """
        self.metadata = metadata

    def get_discount(self):
        """
        Get the discount percentage of the photo
        """
        return self.discount

    def get_discounted_price(self):
        """
        Get the discounted price of the photo
        @return price : integer
        """
        discounted_price = self.price - self.price * (self.discount / 100)
        # Because round() doesn't actually round, we had to do this
        return math.floor(discounted_price + 0.5)

    def get_user(self):
        """
        Get the creator of the photo
        """
        return self.user

    def set_user(self, this_user):
        """
        Set the owner of the photo
        @param user: User: mongoengine.Document
        """
        self.user = this_user

    def increment_likes(self):
        """
        Increase the likes by one
        Increase the likes of the user by one
        Save the user object
        """
        self.likes += 1

    def decrement_likes(self):
        """
        Decrement likes by one unless likes == 0
        Decrease the likes of the user by one
        Save the user object
        """
        self.likes -= 1

    def reset_likes(self):
        """
        Reset likes to 0
        """
        self.likes = 0

    def get_likes(self):
        """
        Get number of likes for the photo
        """
        return self.likes

    def add_comment(self, this_comment):
        """
        Add a single comment to the photo
        @param comment: ObjectId
        """
        # Param should be ObjectId
        self.comments.append(this_comment)

    def delete_comment(self, this_comment):
        """
        Remove a single comment to the photo
        @param comment: ObjectId
        """
        self.comments.remove(this_comment)

    def get_comments(self):
        """
        Get all the comments
        """
        return self.comments

    def remove_collection(self, old_collection):
        """
        Remove a collection from this photo's references
        """
        if self in old_collection.photos:
            old_collection.photos.remove(self)
            old_collection.save()
        if old_collection in self.collections:
            self.collections.remove(old_collection)

    def delete_photo(self):
        """
        Delete the photo by setting the deleted flag to False
        """
        self.deleted = True

    def undelete_photo(self):
        """
        Restore the photo but not to the albums and collections
        WARNING: Not sure of the longterm ramifications of this
        """
        self.deleted = False

    def is_deleted(self):
        """
        Determine whether the photo is deleted or not
        @return True on deleted, False otherwise
        """
        return self.deleted

    def add_collection(self, new_collection):
        """
        Add a collection to the photo's list of collections
        @param collection : lib.collection.jajaccollection.Collection
        """
        self.collections.append(new_collection)

    def get_collections(self):
        """
        Get the collection objects
        """
        return self.collections

    def get_extension(self):
        """
        Get the collection objects
        """
        return self.extension

    def get_thumbnail(self, u_id):
        """
        Get the watermarked or non watermarked thumbnail based on
        whether the u_id passed in owns the photo

        Returns metadata and base64 string
        """

        # SVG thumbnails are in png format
        metadata = self.get_metadata()
        extension = self.get_extension()
        if extension == ".svg":
            metadata = metadata.replace("svg+xml", "png")
            extension = ".png"

        try:
            this_user = user.User.objects.get(id=u_id)
            if self in this_user.get_all_purchased() or this_user == self.get_user():
                return [metadata, find_photo(f"{self.get_id()}_t{extension}")]
            return [metadata, find_photo(f"{self.get_id()}_t_w{extension}")]
        except:
            return [metadata, find_photo(f"{self.get_id()}_t_w{extension}")]

    def get_full_image(self, u_id):
        """
        Get the watermarked or non watermarked full-res image based on
        whether the u_id passed in owns the photo. For downloading purposes.

        Returns metadata, base64 string, extension
        """
        metadata = self.get_metadata()
        extension = self.get_extension()
        try:
            this_user = user.User.objects.get(id=u_id)
            if self in this_user.get_all_purchased() or this_user == self.get_user():
                return [metadata, find_photo(f"{self.get_id()}{extension}"), extension]
            if extension == ".svg":
                metadata = metadata.replace("svg+xml", "png")
                extension = ".png"

            return [
                metadata,
                find_photo(f"{self.get_id()}_w{extension}"),
                extension,
            ]
        except:
            if extension == ".svg":
                metadata = metadata.replace("svg+xml", "png")
                extension = ".png"

            return [metadata, find_photo(f"{self.get_id()}_w{extension}"), extension]

    def is_photo_owner(self, this_user):
        """
        Check if the user is the owner of the photo
        @return boolean
        """
        return this_user == self.get_user()

    def is_owned(self, req_user):
        '''
        @param req_user:mongoengine.Document.User
        '''
        try:
            return (self in req_user.get_all_purchased()) or (
                self.is_photo_owner(req_user)
            )
        except:
            return False

    def get_photo_json(self):
        """
        Return object as JSON
        Any reference fields are returned as object ids
        """
        return {
            "title": self.get_title(),
            "price": self.get_price(),
            "albums": [album.id for album in self.get_albums()],
            "collection": [coll.id for coll in self.get_collections()],
            "tags": self.get_tags(),
            "metadata": self.get_metadata(),
            "discount": self.get_discount(),
            "posted": self.get_posted(),
            "user": self.get_user().id,
            "extension": self.get_extension(),
            "likes": self.get_likes(),
            "comments": [comment.id for comment in self.get_comments()],
            "deleted": self.is_deleted(),
        }

    def clean(self):
        """
        Methods called as part of save()
        1) Ensure that the tags are unique
        """
        if list(set(self.tags)) is not self.tags:
            self.tags = list(set(self.tags))
