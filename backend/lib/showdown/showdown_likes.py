'''
Showdown likes related functions
'''
import mongoengine

import lib.token_functions as token_functions
from bson.objectid import ObjectId
from bson.errors import InvalidId
from datetime import datetime
import lib.photo.photo as photo
import lib.user.user as user
import lib.showdown.showdown as showdown
import lib.showdown.participant as participant

def update_showdown_likes(token, sd_id, part_id):
    u_id = token_functions.verify_token(token)["u_id"]
    try:
        oid = ObjectId(u_id)
    except InvalidId:
        print("u_id is not a valid ObjectId. Look closely at it")
        print(u_id)
        raise TokenError("u_id is not a valid ObjectId." + u_id)
    try:
        _showdown = showdown.Showdown.objects.get(id=sd_id)
    except showdown.Showdown.DoesNotExist:
        print("Showdown does not exist")
        raise
    
    try:
        _participant = participant.Participant.objects.get(id=part_id)
    except participant.Participant.DoesNotExist:
        print("Participating does not exist")
        raise
              
    #Users cannot like both photos in showdown
    if has_showdown_liked(u_id, _showdown.participants[0]) == True and has_showdown_liked(u_id, _showdown.participants[1]) == True:
        raise
     
    if has_showdown_liked(u_id, _participant) == True:
        showdown_unlike(u_id, _participant)
        return "unliked"
    elif has_showdown_liked(u_id, _showdown.participants[0]) == False and has_showdown_liked(u_id, _showdown.participants[1]) == False:
        showdown_like(u_id, _participant)
        return "liked"
    else:
        if has_showdown_liked(u_id, _showdown.particpants[0]) == False:
            showdown_like(u_id, _showdown.participants[0])
            showdown_unlike(u_id, _showdown.participants[1])
        else:
            showdown_like(u_id, _showdown.participants[1])
            showdown_unlike(u_id, _showdown.participants[0])           
        return "swap"
    
    return "swap"

def get_showdown_likes(part_id):
    try:
        _participant = participant.Participant.objects.get(id=part_id)
    except participant.Participant.DoesNotExist:
        print("Participating does not exist")
        raise
    return len(_participant.get_votes())
#Temporary Function
#def create_dummy_showdown():
#    photo1 = photo.Photo.objects.get(id="5fa46a46c7d4a0e99df98ee0")
#    photo2 = photo.Photo.objects.get(id="5fa755b596826652f59f3634")
#    new_participant1 = participant.Participant(
#        photo = photo1,
#    )
#    new_participant1.save()
#    
#    new_participant2 = participant.Participant(
#        photo = photo2,
#    )
#    new_participant2.save()
#
#    new_showdown = showdown.Showdown(
#        start_date = datetime.now()
#    )
#    new_showdown.add_participant(new_participant1)
#    new_showdown.add_participant(new_participant2)
#    new_showdown.save()

#Helper Functions (Should not be used outside of showdown_likes)
def has_showdown_liked(u_id, part_object):
    try:
        _user = user.User.objects.get(id=u_id)
    except user.User.DoesNotExist:
        print("User does not exist")
        raise
    
    return _user in part_object.get_votes()
    
def showdown_like(u_id, part_object):
    try:
        _user = user.User.objects.get(id=u_id)
    except user.User.DoesNotExist:
        print("User does not exist")
        raise
    
    if has_showdown_liked(u_id, part_object) == False:
        part_object.add_vote(_user)
        part_object.save()

def showdown_unlike(u_id, part_object):
    try:
        _user = user.User.objects.get(id=u_id)
    except user.User.DoesNotExist:
        print("User does not exist")
        raise
    
    if has_showdown_liked(u_id, part_object) == True:
        part_object.remove_vote(_user)
        part_object.save()
    