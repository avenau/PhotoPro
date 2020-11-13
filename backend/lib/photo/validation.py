'''
Photo mongoengine.Document custom validation
Note that mongoengine provides basic validation
    such as type checking. Add additonal validation
    here and add it to the Document definition as
    a parameter

    e.g.
    Class Photo(Document):
        title = StringField(validation=validation.validate_title)
'''
import traceback
import json
import mongoengine
from bson.objectid import ObjectId
import lib.Error as Error



def validate_price(price):
    '''
    Make sure price doesn't fall below zero
    '''

    # Use mongoengine's validation
    try:
        mongoengine.IntField().validate(price)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise Error.ValidationError("Price field is not an integer")

    # Our own custom validation
    if price < 0:
        raise Error.ValidationError("Price of photo cannot fall below zero")


def validate_discount(discount):
    '''
    Validate the discount changes
    '''
    try:
        mongoengine.IntField().validate(discount)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise Error.ValidationError("Discount is not a valid integer")
    if discount < 0:
        raise Error.ValidationError("Discount must be greater than 0")
    if discount > 100:
        raise Error.ValidationError("Discount must be less than 100")


def validate_extension(extension):
    '''
    Validate extension of the photo
    '''

    try:
        mongoengine.StringField().validate(extension)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise Error.ValidationError("Extension is not valid")
    exts = [".jpg", ".jpeg", ".png", ".svg"]
    if extension not in exts:
        raise ValueError("Unacceptable file type")


def validate_tags(tags):
    '''
    @param tags [string]
    '''
    try:
        mongoengine.ListField().validate(tags)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise Error.ValidationError("Tag list is not valid")

    if len(tags) > 10:
        raise Error.ValidationError("Cannot contain more than 10 tags")

    for tag in tags:
        try:
            mongoengine.StringField().validate(tag)
        except mongoengine.ValidationError:
            print(traceback.print_exc())
            raise Error.ValidationError("String field for tag is not valid")
        if tag is None or len(tag) < 1:
            raise Error.ValidationError("Tag cannot be an empty string")
        if len(tag) > 20:
            raise Error.ValidationError("Tag cannot have more than 20 characters")


def validate_title(title):
    '''
    Check the title is not empty
    @param title: string
    '''
    try:
        mongoengine.StringField().validate(title)
    except mongoengine.ValidationError:
        print(traceback.print_exc())
        raise Error.ValidationError("Title is not a valid string")
    if title is None or len(title) < 1 or len(title) > 40:
        raise Error.ValidationError("Title must be between 1 and 40 characters")

def validate_albums(albums):
    '''
    Check the album has a non-empty strings
    '''
    try:
        mongoengine.ListField().validate(albums)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError

    for i in albums:
        if i is None or i == "":
            raise Error.ValueError("Cannot be empty or None")

def validate_collections(collections):
    '''
    @param tags: [Collection]
    '''
    try:
        mongoengine.ListField().validate(collections)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError

def validate_metadata(metadata):
    '''
    @param metadata: string
    '''
    try:
        mongoengine.StringField().validate(metadata)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError

def validate_posted(posted):
    '''
    @param posted: datetime
    '''
    try:
        mongoengine.DateTimeField().validate(posted)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError


def validate_user(this_user):
    '''
    @param this_user: User
    '''
    try:
        mongoengine.ReferenceField('user.User').validate(this_user)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError

def validate_likes(likes):
    '''
    @param likes: int
    '''
    try:
        mongoengine.IntField().validate(likes)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError

def validate_comments(comments):
    '''
    @param comments: [Comment]
    '''
    try:
        mongoengine.ListField().validate(comments)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError

def validate_deleted(deleted):
    '''
    @param deleted: boolean
    '''
    try:
        mongoengine.BooleanField().validate(deleted)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError
