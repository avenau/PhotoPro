from bson.json_util import dumps
from json import loads

def user_search(data, mongo):
  res = mongo.db.users.aggregate(
    [
      {
        "$match": {
          "$or": [
            { "fname": {"$regex": data["query"], "$options": "i"}},
            { "lname": {"$regex": data["query"], "$options": "i"}},
            { "nickname": {"$regex": data["query"], "$options": "i"}}
          ]
        }
      },
      {
        "$project": {
          "fname": 1,
          "lname": 1,
          "nickname": 1,
          "email": 1,
          "location": 1,
          "id": {"$toString": "$_id"},
          "_id": 0
        }
      },
      {
        "$skip": data["offset"]
      },
      {
        "$limit": data["limit"]
      }
    ]
  )
  res = loads(dumps(res))
  return res