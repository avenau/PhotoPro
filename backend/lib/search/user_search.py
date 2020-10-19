from bson.json_util import dumps
from json import loads

def user_search(data, mongo):
  print(data)
  res = mongo.db.users.find(
    {
      "$or": [
         { "fname": {"$regex": data["query"], "$options": "i"}},
         { "lname": {"$regex": data["query"], "$options": "i"}},
         { "nickname": {"$regex": data["query"], "$options": "i"}}
      ]
    },
    {
      "fname": 1,
      "lname": 1,
      "nickname": 1,
      "email": 1,
      "location": 1,
      "_id": 0,
    }
  ).skip(data["offset"]).limit(data["limit"])

  return loads(dumps(res))