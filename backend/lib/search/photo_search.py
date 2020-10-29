from bson.json_util import dumps
from json import loads
import base64

def photo_search(data, mongo):
  res = mongo.db.photos.aggregate(
    [
      {
        "$match": {
          "$or": [
            { "title": {"$regex": data["query"], "$options": "i"}}
          ]
        }
      },
      {
        "$project": {
          "title": 1,
          "price": 1,
          "discount": 1,
          "pathThumb": 1,
          "metadata": 1,
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
  for result in res:
    with open(result["pathThumb"], "rb") as f:
        img = f.read()
    result["photoStr"] = str(base64.b64encode(img))
  return res