'''
Get all comments for a photo
'''
import traceback
from lib.Error import PhotoDNE
import lib.photo.photo as photo
from json import dumps

def get_all_comments(p_id):
    '''
    Get all comments for a photo
    @param p_id: string(photo id)
    @return [
        commenter: User,
        datePosted: datetime,
        content: string
    ]
    '''
    this_photo = photo.Photo.objects.get(id=p_id)
    if not this_photo:
        print(traceback.format_exc)
        raise PhotoDNE("Could not find photo")
    comments = this_photo.get_comments()
    result = []
    for comment in comments:
        result.append(dumps({
                'commenter': comment.get_commenter().get_nickname(),
                'datePosted': str(comment.get_posted()),
                'content': comment.get_content(),
                'commenter_id': str(comment.get_commenter().get_id()),
            }))
    
    
    return result
