from lib.Error import UserDNE, TokenError
from bson.objectid import ObjectId
from bson.errors import InvalidId
from json import dumps

def get_all_comments(p_id, mongo):
    try:
        p_oid = ObjectId(p_id)
    except InvalidId:
        raise TokenError("p_id is not a valid ObjectId." + p_id)
    photo = mongo.db.photos.find_one({"_id": p_oid})
    result = []
    comment_ids = photo['comments']
    for comment_id in comment_ids:
        if comment_id == "TODO":
            continue
        comment = mongo.db.comments.find_one({"_id":comment_id})
        commenter = mongo.db.users.find_one({"_id":comment['commenter']})['nickname']
        datePosted = comment['posted']
        content = comment['content']
        result.append(dumps({"commenter":commenter, "datePosted":datePosted, "content":content}))
    return result