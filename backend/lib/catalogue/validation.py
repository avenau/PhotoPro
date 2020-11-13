"""
Catalogue Validation
"""

import traceback
import mongoengine
import lib.Error as Error
import lib.user.user as user


def validate_title(title):
    """
    Check if the user can make an album with a given title.
    Duplicate album/collection names for a user are not
    @param title str
    @param user mongo obj
    """
    try:
        mongoengine.StringField(max_length=40).validate(title)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("String is too long")

    if title == "":
        raise Error.ValueError("Please enter a title")


def validate_photos(photos):
    """
    @param [Document.photo]
    """
    try:
        mongoengine.ListField().validate(photos)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Photo list field is incorrect")


def validate_creation_date(creation_date):
    """
    @param creation_date:datetime
    """
    try:
        mongoengine.DateTimeField().validate(creation_date)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Date is not of correct format")


def validate_created_by(created_by):
    """
    @param created_by:Document.user
    """
    try:
        mongoengine.ReferenceField("user.User").validate(created_by)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Album User is not valid")


def validate_tags(tags):
    """
    @param list[string]
    """
    try:
        mongoengine.ListField().validate(tags)
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Tag list is not correct")
    for tag in tags:
        try:
            mongoengine.StringField().validate(tag)
        except mongoengine.ValidationError:
            print(traceback.format_exc())
            raise Error.ValidationError("Tag " + tag + " is not valid")
