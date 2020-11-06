'''
Get all comments for a photo
'''
import traceback
from lib.Error import PhotoDNE
import lib.photo.photo as photo
from json import dumps
from datetime import datetime, date, timedelta
import math

def get_all_comments(p_id, current_date):
    '''
    Get all comments for a photo
    @param p_id: string(photo id)
    @return [
        commenter: User,
        datePosted: datetime,
        content: string,
        exact_time: string,
    ]
    '''
    this_photo = photo.Photo.objects.get(id=p_id)
    if not this_photo:
        print(traceback.format_exc)
        raise PhotoDNE("Could not find photo")
    comments = this_photo.get_comments()
    result = []
    
    
    for comment in comments:

        #current_date = datetime.now()
        print("PRINTING Date Test")
        print(current_date)
        years_ago = current_date.year - comment.get_posted().year
        months_ago = current_date.month - comment.get_posted().month
        days_ago = current_date.day - comment.get_posted().day
        hours_ago = current_date.hour - comment.get_posted().hour
        minutes_ago = current_date.minute - comment.get_posted().minute
        
        time_diff = current_date - comment.get_posted()
        print("Printing Time Delta")
        print(str(time_diff.total_seconds()))
        time_diff_sec = time_diff.total_seconds()
        
        if (time_diff_sec >= 31536000):
            year_diff = math.trunc(time_diff_sec/31536000)
            time_after = str(year_diff) + " years ago"
        elif (time_diff_sec >= 2592000):
            month_diff = math.trunc(time_diff_sec/2592000)
            time_after = str(month_diff) + " months ago"
        elif (time_diff_sec >=  86400):
            day_diff = math.trunc(time_diff_sec/86400)
            time_after = str(day_diff) + " days ago"
        elif (time_diff_sec >= 3600):
            hour_diff = math.trunc(time_diff_sec/3600) 
            time_after = str(hour_diff) + " hours ago"
        elif (time_diff_sec >= 60):
            minute_diff = math.trunc(time_diff_sec/60)
            time_after = str(minute_diff) + " minutes ago"
        else:
            #For Debugging, probably gonna set it to "moments ago"
            time_after = str(math.trunc(time_diff_sec)) + " seconds ago"
        
        comment_id = str(comment.get_id())
        
        
        result.append(dumps({
                'commenter': comment.get_commenter().get_nickname(),
                'datePosted': str(comment.get_posted()),
                'content': comment.get_content(),
                'commenter_id': str(comment.get_commenter().get_id()),
                'exact_time': comment.get_posted().strftime("%d/%b/%Y %H:%M"),
                'time_after': time_after,
                'comment_id': comment_id,
            }))
    
    
    return result
