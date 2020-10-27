'''
Dummy Photo class and methods
'''

from mongoengine import StringField
from mongoengine import ListField
from mongoengine import DateTimeField
from mongoengine import IntField
from mongoengine import BooleanField
from mongoengine import Document


class Photo(Document):
    '''
    Dummy photo class for testing Collection
    '''
    title = StringField()
    price = IntField()
    # albums = ListField()
    tags = ListField(StringField())
    discount = IntField()
    posted = DateTimeField()
    # user = ReferenceField()
    likes = IntField()
    comments = ListField(StringField())
    deleted = BooleanField(default=False)
    pathToImg = StringField()
