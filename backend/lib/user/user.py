'''
User Class for mongoengine
'''

import datetime
from mongoengine import StringField
from mongoengine import ListField
from mongoengine import IntField
from mongoengine import Document
from mongoengine import ReferenceField
from mongoengine import EmailField
from mongoengine import BinaryField

import lib.photo.photo as photo
import lib.collection.collection as collection
import lib.user.validate_login as validate_login
import lib.user.validate_registration as validate_registration
import lib.user.validation as validation
import lib.Error as Error


class User(Document):
    '''
    Mongoengine User definition
    NOTE: Password is assumed to always be a binary hash
    '''
    # User's first name
    fname = StringField(required=True)
    # User's last name
    lname = StringField(required=True)
    # User's email
    email = EmailField(required=True, unique=True)
    # User's nickname
    nickname = StringField(required=True)
    # User's hashed password
    password = BinaryField(required=True)
    # User's profile pic, base64 encoded string
    profile_pic = ListField(StringField())
    # User's profile pic extension
    extension = StringField(validation=validation.validate_extension)
    # User's info about themself
    about_me = StringField()
    # User's country, validated again the location list
    location = StringField(validation=validate_registration.valid_location)
    # Array of Photo references that the user has posted
    posts = ListField(ReferenceField('photo.Photo'))
    """
    # TODO:
    # User's albums that they've created
    # albums = ListField()
    """
    # Array of Collection references that the user has created
    collections = ListField(ReferenceField('collection.Collection'))
    # Array of liked Photo references
    likes = ListField(ReferenceField('photo.Photo'))
    # Array of purchased Photo references
    purchased = ListField(ReferenceField('photo.Photo'))
    # User's current credits
    credits = IntField(default=0, validation=validation.validate_credit)
    # Meta data about the User collection
    meta = {'collection': 'users-mongoengine'}

    # User Methods:
    # -------------
    def get_id(self):
        '''
        Object id of the user
        '''
        return self.id

    def get_fname(self):
        '''
        Get user's first name
        '''
        return self.fname

    def set_fname(self, fname):
        '''
        Set user's first name
        '''
        self.fname = fname
        self.validate()

    def get_lname(self):
        '''
        Get user's last name
        '''
        return self.lname

    def set_lname(self, lname):
        '''
        Set user's last name
        '''
        self.lname = lname

    def get_email(self):
        '''
        Get user's email
        '''
        return self.email

    def set_email(self, email):
        '''
        Assign a new email
        '''
        self.email = email

    def get_nickname(self):
        '''
        Get the nickname of the user
        '''
        return self.nickname

    def set_nickname(self, nickname):
        '''
        Set the nickname to something new
        '''
        self.nickname = nickname

    def get_password(self):
        '''
        Gets the password of the user
        '''
        return self.password

    def set_password(self, b_password):
        '''
        Set the password to a new binary string
        @param b_password: binary
        '''
        self.password = b_password

    def is_matching_password(self, b_password):
        '''
        Check that the passwords match
        @param b_password: byte literal
        @returns True on match, False otherwise
        '''
        if not isinstance(b_password, bytes):
            raise ValueError("Password must be a byte literal")
        return self.get_password() == b_password

    def get_profile_pic(self):
        '''
        Get the profile picture of the user
        '''
        return self.profile_pic

    def set_profile_pic(self, pic):
        '''
        Set the profile pic of the user
        @param pic: string(base64)
        '''
        self.profile_pic = pic

    def get_extension(self):
        '''
        Return the extension of the profile picture
        '''
        return self.extension

    def set_extension(self, ext):
        '''
        Set the extension
        Raises a ValidationError on failed vaidate_extension()
        @param ext: str(e.g. .jpg)
        '''
        self.extension = ext

    def get_about_me(self):
        '''
        Return user's About Me string
        '''
        return self.about_me

    def set_about_me(self, about_me):
        '''
        Set the about me string
        @param about_me: string
        '''
        self.about_me = about_me

    def get_location(self):
        '''
        Get the country of the user
        '''
        return self.location

    def set_location(self, location):
        '''
        Sets the location, validates against the location list
        @param location: string(from location list)
        '''
        self.location = location

    def get_posts(self):
        '''
        Returns all non-deleted posts
        '''
        posts = []
        for post in self.posts:
            if not post.is_deleted():
                posts.append(post)
        return posts

    def get_posts_id(self):
        '''
        Returns all non-deleted posts
        '''
        posts = []
        for post in self.posts:
            if not post.is_deleted():
                posts.append(str(post.get_id()))
        return posts

    def add_post(self, this_photo):
        '''
        Add a new photo to the user's posts
        '''
        self.posts.append(this_photo)

    def remove_post(self, this_photo):
        '''
        Remove a photo from the user's posts
        DO WE NEED TO REMOVE IT FROM THE COLLECTIONS?
        '''
        self.posts.remove(this_photo)

    def get_collections(self):
        '''
        Get non-deleted collections
        '''
        collections = []
        for coll in self.collections:
            if not coll.deleted:
                collections.append(coll)
        return collections

    def get_liked(self):
        '''
        Get the photos that this user likes
        Don't include deleted photos
        '''
        liked = []
        for like in self.likes:
            if like.deleted is False:
                liked.append(like)
        return liked

    def add_liked_photo(self, this_photo):
        '''
        Add a photo to the photos this user likes
        '''
        self.likes.append(this_photo)

    def remove_liked_photo(self, this_photo):
        '''
        Remove a photo from the liked photos
        '''
        self.likes.remove(this_photo)

    def get_purchased(self):
        '''
        Get the photos that the user has purchased
        '''
        purchased = []
        for item in self.purchased:
            if not item.deleted:
                purchased.append(item)
        return purchased

    def add_purchased(self, this_photo):
        '''
        Add a photo to purchased photos
        '''
        self.purchased.append(this_photo)

    def get_credits(self):
        '''
        Get user's credits
        '''
        return self.credits

    def add_credits(self, credit):
        '''
        Add credit to User's credits
        Validation passed by validation.validate_credit()
        @param: credit: int
        '''
        if not isinstance(credit, int):
            raise Error.ValueError("Credits must be of type integer.")
        self.credits = self.credits + credit

    def remove_credits(self, credit):
        '''
        Remove credit from User's credits
        Validation passed by validation.validate_credit()
        @param: credit: int
        '''
        if not isinstance(credit, int):
            raise Error.ValueError("Credits must be of type integer.")
        self.credits = self.credits - credit

    # User Document validation
    # ------------------------
    def clean(self):
        '''
        Run on every User.save()
        Add validation checks here
        '''
