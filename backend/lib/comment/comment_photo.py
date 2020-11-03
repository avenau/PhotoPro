from lib.Error import UserDNE, TokenError
from bson.objectid import ObjectId
from bson.errors import InvalidId

def comments_photo(p_id, u_id, posted, content, mongo):
    try:
        commenter_oid = ObjectId(u_id)
        print("CURRENT ID: " + u_id)
    except InvalidId:
        raise TokenError("u_id is not a valid ObjectId." + u_id)
        
    try:
        photo_oid = ObjectId(p_id)
    except InvalidId:
        raise TokenError("p_id is not a valid ObjectId." + p_id)
        
    comment_id = mongo.db.comments.insert({"posted" : posted, "content" : content, "commenter" : commenter_oid})
    print("COMMMENT ID")
    print(comment_id)
    
    try:
        comment_oid = ObjectId(comment_id)
    except InvalidId:
        raise TokenError("comment_id is not a valid ObjectId." + comment_id)
    mongo.db.photos.update_one({"_id": photo_oid}, { "$push": { "comments": comment_oid } })
    