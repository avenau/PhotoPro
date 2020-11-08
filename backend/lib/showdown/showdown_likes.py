'''
Showdown likes related functions
'''
import lib.token_functions as token_functions
import lib.showdown.showdown
import lib.showdown.participating

def update_showdown_likes(token, sd_id, part_id):
    user_id = token_functions.verify_token(token)["u_id"]
    try:
        _showdown = showdown.Showdown.objects.get(id=sd_id)
    except showdown.Showdown.DoesNotExist:
        print("Showdown does not exist")
        raise
    
    try:
        _participating = participating.Participating.objects.get(id=part_id)
    except participating.Participating.DoesNotExist:
        print("Participating does not exist")
        raise
        
    #Check if any of the participatings are liked by the user
    #If so remove the like from one participating and add one like to another then return "swap"
    
    #else
    #If already liked, remove user from list and return "unlike"
    
    
    return "liked"

#TODO
def has_showdown_liked(token, part_id):
    user_id = token_functions.verify_token(token)["u_id"]
    try:
        _participating = participating.Participating.objects.get(id=part_id)
    except participating.Participating.DoesNotExist:
        print("Participating does not exist")
        raise
    
    return True
    