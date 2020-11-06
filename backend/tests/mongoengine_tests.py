'''
Interactive database muckaround
'''

from mongoengine import connect
import lib.photo.photo as photo
import lib.collection.collection as collection
import lib.user.user as user

connect('angular-flask-muckaround')

photo.Photo.objects(title='new_photo').first().delete()
user.User.objects(fname='Joe').first().delete()


new_photo = photo.Photo(title='new_photo', price=50)

new_user = user.User(fname='Joe',
                     lname='Aczel',
                     email='j@czel.com',
                     nickname='Jaczel',
                     password=(b'123'))

