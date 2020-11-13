"""
User Class for mongoengine
"""

import datetime
from mongoengine import StringField
from mongoengine import ListField
from mongoengine import IntField
from mongoengine import Document
from mongoengine import ReferenceField
from mongoengine import EmailField
from mongoengine import BinaryField
from mongoengine.fields import DateTimeField

import lib.photo.photo as photo
import lib.collection.collection as collection
import lib.album.album as album
import lib.user.validate_login as validate_login
import lib.user.validate_registration as validate_registration
import lib.user.validation as validation
import lib.Error as Error


class User(Document):
    """
    Mongoengine User definition
    NOTE: Password is assumed to always be a binary hash
    fname: string
    lname: string
    email: email
    nickname: string
    password: binary
    profile_pic: [string]
    about_me: string
    location: string
    posts: [Post]
    albums: [Album]
    collections: [Collection]
    likes: integer
    purchased: [Photo]
    credits: integer
    created: datetime
    following: [User]
    recommended_keywords: [string]
    """

    # User's first name
    fname = StringField(required=True, validation=validation.validate_fname)
    # User's last name
    lname = StringField(required=True, validation=validation.validate_lname)
    # User's email
    email = EmailField(required=True, unique=True, validation=validation.validate_email)
    # User's nickname
    nickname = StringField(required=True,
                           validation=validation.validate_nickname)
    # User's hashed password
    password = BinaryField(required=True,
                           validation=validation.validate_password)
    # User's profile pic, base64 encoded string
    profile_pic = ListField(StringField(),
                            validation=validation.validate_profile_pic)
    # User's info about themself
    about_me = StringField(validation=validation.validate_about_me)
    # User's country, validated again the location list
    location = StringField(validation=validation.validate_location)
    # Array of Photo references that the user has posted
    posts = ListField(ReferenceField("photo.Photo"),
                      validation=validation.validate_posts)
    # Array of Album references that the user has created
    albums = ListField(ReferenceField("album.Album"),
                       validation=validation.validate_albums)
    # Array of Collection references that the user has created
    collections = ListField(ReferenceField("collection.Collection"),
                            validation=validation.validate_collections)
    # Array of liked Photo references
    likes = ListField(ReferenceField("photo.Photo"),
                      validation=validation.validate_likes)
    # Array of purchased Photo references
    purchased = ListField(ReferenceField("photo.Photo"),
                          validation=validation.validate_purchased)
    # User's current credits
    credits = IntField(default=0, validation=validation.validate_credit)
    # When the user was created
    created = DateTimeField(required=True,
                            validation=validation.validate_created)
    # List of the searches made by the user, ordered with recent searches first
    searches = ListField(StringField(), validation=validation.validate_searches)
    # Reference to all users this user is following
    following = ListField(ReferenceField("User"),
                          validation=validation.validate_following)
    # List of keywords, which act as metrics for recommending photos for the user
    recommend_keywords = ListField(StringField(),
                                   validation=validation.validate_recommended_keywords)
    # Meta data about the User collection
    meta = {"collection": "users"}

    # User Methods:
    # -------------
    def get_id(self):
        """
        Object id of the user
        """
        return self.id

    def get_fname(self):
        """
        Get user's first name
        """
        return self.fname

    def set_fname(self, fname):
        """
        Set user's first name
        """
        self.fname = fname
        self.validate()

    def get_lname(self):
        """
        Get user's last name
        """
        return self.lname

    def set_lname(self, lname):
        """
        Set user's last name
        """
        self.lname = lname

    def get_email(self):
        """
        Get user's email
        """
        return self.email

    def set_email(self, email):
        """
        Assign a new email
        """
        self.email = email

    def get_nickname(self):
        """
        Get the nickname of the user
        """
        return self.nickname

    def set_nickname(self, nickname):
        """
        Set the nickname to something new
        """
        self.nickname = nickname

    def get_password(self):
        """
        Gets the password of the user
        """
        return self.password

    def set_password(self, b_password):
        """
        Set the password to a new binary string
        @param b_password: binary
        """
        self.password = b_password

    def is_matching_password(self, b_password):
        """
        Check that the passwords match
        @param b_password: byte literal
        @returns True on match, False otherwise
        """
        if not isinstance(b_password, bytes):
            raise ValueError("Password must be a byte literal")
        return self.get_password() == b_password

    def get_profile_pic(self):
        """
        Get the profile picture of the user
        """
        return self.profile_pic

    def set_profile_pic(self, pic):
        """
        Set the profile pic of the user
        @param pic: string(base64)
        """
        self.profile_pic = pic

    def get_about_me(self):
        """
        Return user's About Me string
        """
        return self.about_me

    def set_about_me(self, about_me):
        """
        Set the about me string
        @param about_me: string
        """
        self.about_me = about_me

    def get_location(self):
        """
        Get the country of the user
        """
        return self.location

    def set_location(self, location):
        """
        Sets the location, validates against the location list
        @param location: string(from location list)
        """
        self.location = location

    def get_posts(self):
        """
        Returns all non-deleted posts
        """
        posts = []
        for post in self.posts:
            if not post.is_deleted():
                posts.append(post)
        return posts

    def get_posts_id(self):
        """
        Returns all non-deleted posts
        """
        posts = []
        for post in self.posts:
            if not post.is_deleted():
                posts.append(str(post.get_id()))
        return posts

    def add_post(self, this_photo):
        """
        Add a new photo to the user's posts
        """
        self.posts.append(this_photo)

    def remove_post(self, this_photo):
        """
        Remove a photo from the user's posts
        DO WE NEED TO REMOVE IT FROM THE COLLECTIONS?
        """
        self.posts.remove(this_photo)

    def add_collection(self, _collection):
        """
        Add collection object to album list
        """
        self.collections.append(_collection)

    def get_collections(self):
        """
        Get non-deleted collections
        """
        return self.collections

    def add_album(self, _album):
        """
        Add album object to album list
        """
        self.albums.append(_album)

    def get_albums(self):
        """
        Get non-deleted albums
        """
        return self.albums

    def get_liked(self):
        """
        Get the photos that this user likes
        Don't include deleted photos
        """
        liked = []
        for like in self.likes:
            if like.deleted is False:
                liked.append(like)
        return liked

    def add_liked_photo(self, this_photo):
        """
        Add a photo to the photos this user likes
        """
        self.likes.append(this_photo)

    def remove_liked_photo(self, this_photo):
        """
        Remove a photo from the liked photos
        """
        self.likes.remove(this_photo)

    def get_all_purchased(self):
        """
        Get the photos that the user has purchased, including deleted ones
        """
        return self.purchased

    def get_purchased(self):
        """
        Get the photos that the user has purchased, excluding deleted ones
        """
        purchased = []
        for item in self.purchased:
            if not item.deleted:
                purchased.append(item)
        return purchased

    def add_purchased(self, this_photo):
        """
        Add a photo to purchased photos
        """
        self.purchased.append(this_photo)

    def get_credits(self):
        """
        Get user's credits
        """
        return self.credits

    def add_credits(self, credit):
        """
        Add credit to User's credits
        Validation passed by validation.validate_credit()
        @param: credit: int
        """
        if not isinstance(credit, int):
            raise Error.ValueError("Credits must be of type integer.")
        self.credits = self.credits + credit

    def remove_credits(self, credit):
        """
        Remove credit from User's credits
        Validation passed by validation.validate_credit()
        @param: credit: int
        """
        if not isinstance(credit, int):
            raise Error.ValueError("Credits must be of type integer.")
        self.credits = self.credits - credit

    def add_search(self, search):
        """
        Add search to user's list of searches
        @param: search: string
        """
        # Don't add search if it is empty string
        if search == "" or (len(self.searches) > 0 and search == self.searches[0]):
            return

        # Ensure search list keeps 10 most recent results
        if len(self.searches) >= 10:
            self.searches.pop()

        self.searches.insert(0, search)

    def get_searches(self):
        """
        Get user searches
        @param: search: string
        """
        return self.searches

    def get_recommend_keywords(self):
        """
        Get keywords from photos a user has interacted with or search queries
        """
        return self.recommend_keywords

    def set_recommend_keywords(self, keywords):
        """
        Set keywords from photos a user has interacted with or search queries
        """
        self.recommend_keywords = keywords
    
    def add_following(self, user):
        self.following.append(user)
        
    def remove_following(self, user):
        self.following.remove(user)

    # User Document validation
    # ------------------------
    def clean(self):
        """
        Run on every User.save()
        Add validation checks here
        """
