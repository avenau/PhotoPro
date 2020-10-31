'''
User Class for mongoengine
'''

import datetime
from mongoengine import StringField
from mongoengine import ListField
from mongoengine import DateTimeField
from mongoengine import IntField
from mongoengine import Document
from mongoengine import ReferenceField
from mongoengine import EmailField
from mongoengine import ValidationError
from mongoengine import BinaryField

import lib.collection.collection as collection
import lib.photo.photo as photo


# User custom validation
def allowable_extension(ext):
    '''
    Validate the extension
    '''
    exts = ['.jpg', '.jpeg', '.png', '.svg']
    if ext not in exts:
        raise ValidationError("Extension is not one in list " + str(exts))


class User(Document):
    '''
    Mongoengine User definition
    '''
    fname = StringField(required=True)
    lname = StringField(required=True)
    email = EmailField(required=True)
    nickname = StringField(required=True)
    # Assumes a Binary String will be passed
    password = BinaryField(required=True)
    privFName = StringField()
    privLName = StringField()
    profilePic = ListField(StringField())
    extension = StringField(validation=allowable_extension)
    aboutMe = StringField()
    DOB = DateTimeField()
    location = StringField()
    posts = ListField(ReferenceField('photo.Photo'))
    # albums = ListField()
    collections = ListField(ReferenceField('collection.Collection'))
    likes = ListField(IntField())
    purchased = ListField()
    credits = IntField()
    meta = {'collection': 'users-mongoengine'}

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
        # I think this will validate the email... ?
        self.validate()

    def __get_password(self):
        '''
        Gets the password of the user
        Private method
        '''
        return self.password

    def set_password(self, b_password):
        '''
        Set the password to a new binary string
        @param b_password: binary
        '''
        self.password = b_password
        self.validate()

    def is_matching_password(self, b_password):
        '''
        Check that the passwords match
        @param b_password: binary string
        @returns True on match, False otherwise
        '''
        return self.__get_password() == b_password

