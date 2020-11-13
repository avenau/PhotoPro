'''
Interactive database muckaround
'''

from mongoengine import connect
import lib.photo.photo as photo
import lib.showdown.participant as participant
import lib.showdown.showdown as showdown
import lib.user.user as user
import lib.catalogue.catalogue as catalogue
import lib.collection.collection as collection
import lib.album.album as album
import lib.comment.comment as comment

connect('angular-flask-muckaround')

# connect("angular-flask-muckaround", host="mongodb://jajac:databasepassword@coen-townson.me:27017/angular-flask-muckaround?authSource=admin")


