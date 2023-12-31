"""
Comment Mongoengine Class
"""

import datetime
from mongoengine import Document
from mongoengine import DateTimeField
from mongoengine import StringField
from mongoengine import ReferenceField

import lib.user.user as user
import lib.comment.validation as validation


class Comment(Document):
    """
    Comment mongoengine class
    """

    posted = DateTimeField(required=True, validation=validation.validate_posted)
    content = StringField(required=True, validation=validation.validate_content)
    commenter = ReferenceField("user.User", required=True)

    def get_id(self):
        """
        Object id of the photo
        """
        return self.id

    def get_posted(self):
        """
        Get the date the comment was made
        """
        return self.posted

    def get_content(self):
        """
        Get the content of the comment
        """
        return self.content

    def get_commenter(self):
        """
        Get the User object of the person who commented
        """
        return self.commenter
