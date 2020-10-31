'''
Tests for remove user photos
'''

import datetime
from bson import ObjectId

photo = {
    '_id': '5f924493364b9098e954c2b3',
    'title': 'My JPG',
    'price': str(50),
    'albums': ['Random Album'],
    'tags': ['good', 'jpg'],
    'discount': 0,
    'posted': datetime.datetime.now(),
    'user': ObjectId(),
    'likes': 100,
    'won': 'blah',
    'path': './5f924493364b9098e954c2b3.jpg'
}


def test_remove_photo_basic():
    '''
    Come back later
    '''
    pass
