'''
Interactive database muckaround
'''

from mongoengine import connect
import lib.photo.photo as photo
import lib.collection.collection as collection
import lib.user.user as user
import lib.album.album as album

#connect('angular-flask-muckaround')
# connect("mongodb://jajac:databasepassword@coen-townson.me:27017/angular-flask-muckaround?authSource=admin")

# connect("angular-flask-muckaround",
connect("angular-flask-muckaround", host="mongodb://jajac:databasepassword@coen-townson.me:27017/angular-flask-muckaround?authSource=admin")


