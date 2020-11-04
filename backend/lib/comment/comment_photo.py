'''
Comment helper functions
'''

import traceback
from lib.Error import UserDNE, PhotoDNE
import lib.catalogue.catalogue as catalogue
import lib.comment.comment as comment
import lib.user.user as user
import lib.photo.photo as photo


def comments_photo(p_id, u_id, content):
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

    new_comment = comment.Comment(content=content, commenter=this_user)
    new_comment.save()
    this_photo.add_comment(new_comment.get_id())
    this_photo.save()
