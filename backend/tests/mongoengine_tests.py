'''
Interactive database muckaround
'''

from mongoengine import connect
import lib.photo.photo as photo
import lib.collection.collection as collection
import lib.user.user as user

connect('angular-flask-muckaround')
