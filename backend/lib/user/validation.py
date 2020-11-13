'''
Mongoengine validation stuff
'''
import traceback
import mongoengine
import lib.Error as Error
from lib.countries_list import countries


def validate_fname(fname):
    '''
    @param fname: string
    '''
    try:
        mongoengine.StringField().validate(fname)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not validate first name")

def validate_lname(lname):
    '''
    @param lname: string
    '''
    try:
        mongoengine.StringField().validate(lname)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not validate last name")

def validate_email(email):
    '''
    @param email: email
    '''
    try:
        mongoengine.EmailField().validate(email)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not validate email")

def validate_nickname(nickname):
    '''
    @param nickname: string
    '''
    try:
        mongoengine.StringField().validate(nickname)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not validate nickname")

def validate_password(password):
    '''
    @param password: byte_string
    '''
    try:
        mongoengine.BinaryField().validate(password)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not validate password")

def validate_profile_pic(profile_pic):
    '''
    @param profile_pic: string
    '''
    try:
        mongoengine.StringField().validate(profile_pic)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not validate profile picture")

def validate_about_me(about_me):
    '''
    @param about_me: string
    '''
    try:
        mongoengine.StringField().validate(about_me)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not validate About Me")


def validate_location(location):
    '''
    @param location: string
    '''
    try:
        mongoengine.StringField().validate(location)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not validate About Me")
    if location not in countries:
        raise Error.ValidationError("Location not a valid country")

def validate_posts(posts):
    '''
    @param posts: [Post]
    '''
    try:
        mongoengine.ListField().validate(posts)
    except mongoengine.ValidationError:
        raise Error.ValidationError("Could not validate posts")


def validate_likes(likes):
    '''
    Mongoengine validation of likes
    @param likes: str:[]
    '''

    try:
        mongoengine.IntField().validate(likes)
    except mongoengine.ValidationError:
        raise Error.ValidationError("Could not validate likes")


    unreasonable_number_of_likes = 999999
    if likes < 0:
        raise Error.ValidationError("Likes need to be more than 0")
    if likes > unreasonable_number_of_likes:
        raise Error.ValidationError("Cool your jets.")


def validate_credit(credit):
    '''
    Make sure user doesn't end up with negative credits
    '''

    try:
        mongoengine.IntField().validate(credit)
    except Exception:
        print(traceback.format_exc())
        raise Error.ValidationError("Credit validation failed")

    if credit < 0:
        raise Error.ValidationError("Credits cannot be below 0")


def validate_albums(albums):
    '''
    Check the album has a non-empty strings
    '''
    try:
        mongoengine.ListField().validate(albums)
    except mongoengine.ValidationError():
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
    except mongoengine.ValidationError():
        print(traceback.format_exc())
        raise Error.ValidationError

def validate_posted(posted):
    '''
    @param posted: datetime
    '''
    try:
        mongoengine.DateTimeField('user.User').validate(posted)
    except mongoengine.ValidationError():
        print(traceback.format_exc())
        raise Error.ValidationError


def validate_user(this_user):
    '''
    @param this_user: User
    '''
    try:
        mongoengine.ReferenceField('user.User').validate(this_user)
    except mongoengine.ValidationError():
        print(traceback.format_exc())
        raise Error.ValidationError

def validate_comments(comments):
    '''
    @param comments: [Comment]
    '''
    try:
        mongoengine.ListField().validate(comments)
    except mongoengine.ValidationError():
        print(traceback.format_exc())
        raise Error.ValidationError

def validate_deleted(deleted):
    '''
    @param deleted: boolean
    '''
    try:
        mongoengine.BooleanField().validate(deleted)
    except mongoengine.ValidationError():
        print(traceback.format_exc())
        raise Error.ValidationError("Email validation failed")

def validate_following(following):
    '''
    @param following: [User]
    '''
    try:
        mongoengine.ListField().validate(following)
    except mongoengine.ValidationError():
        print(traceback.format_exc())
        raise Error.ValidationError("Following could not be verified")

def validate_purchased(purchased):
    '''
    @param purchased: [Photo]
    '''
    try:
        mongoengine.ListField().validate(purchased)
    except mongoengine.ValidationError():
        print(traceback.format_exc())
        raise Error.ValidationError("Could not validate purchased")

def validate_created(created):
    '''
    @param created: DateTime
    '''
    try:
        mongoengine.DateTimeField().validate(created)
    except mongoengine.ValidationError():
        print(traceback.format_exc())
        raise Error.ValidationError("Could not validate purchased")

def validate_recommended_keywords(recommended_keywords):
    '''
    @param recommended_keywords: [string]
    '''
    try:
        mongoengine.ListField().validate(recommended_keywords)
    except mongoengine.ValidationError():
        print(traceback.format_exc())
        raise Error.ValidationError("Email validation failed")
    for keyword in recommended_keywords:
        try:
            mongoengine.StringField().validate(keyword)
        except mongoengine.ValidationError():
            raise Error.ValidationError("Keyword could not be verified")
