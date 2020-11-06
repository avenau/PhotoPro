'''
Comment helper functions
'''

import traceback
from lib.Error import UserDNE, PhotoDNE
import lib.catalogue.catalogue as catalogue
import lib.comment.comment as comment
import lib.user.user as user
import lib.photo.photo as photo
from datetime import datetime


def comments_photo(p_id, u_id, content, current_date):
    '''
    Create a comment and attach it to the photo
    '''
    this_user = user.User.objects.get(id=u_id)
    if not this_user:
        print(traceback.format_exc)
        raise UserDNE("Could not find user")

    this_photo = photo.Photo.objects.get(id=p_id)
    if not this_photo:
        print(traceback.format_exc)
        raise PhotoDNE("Could not find photo")

    new_comment = comment.Comment(content=content, commenter=this_user, posted=datetime.now())
    new_comment.save()
    this_photo.add_comment(new_comment.get_id())
    this_photo.save()

def delete_photos(p_id, c_id):
    '''
    Deletes a comment
    '''
    this_photo = photo.Photo.objects.get(id=p_id)
    this_comment = comment.Comment.objects.get(id=c_id)
    if not this_photo:
        print(traceback.format_exc)
        print("Photo Did not exist")
        raise PhotoDNE("Could not find photo")
    if not this_comment:
        print(traceback.format_exc)
        print("Comment did not exist")
        raise PhotoDNE("Could not find comment")
    
    this_photo.delete_comment(this_comment)
    this_photo.save()
    this_comment.delete()
    #comment.Comment.save()
    
