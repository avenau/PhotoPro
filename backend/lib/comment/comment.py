'''
Comment Mongoengine Class
'''

import datetime
from mongoengine import Document
from mongoengine import DateTimeField
from mongoengine import StringField
from mongoengine import ReferenceField


class Comment(Document):
    posted = DateTimeField(required=True, default=datetime.datetime.now()),
    content = StringField(required=True),
    commenter = ReferenceField(required=True)

    def get_posted(self):
        '''
        Get the date the comment was made
        '''
        return self.posted

    def get_content(self):
        '''
        Get the content of the comment
        '''
        return self.content

    def get_commenter(self):
        '''
        Get the User object of the person who commented
        '''
        return self.commenter
