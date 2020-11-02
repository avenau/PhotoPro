from bson.json_util import dumps
from json import loads
import base64

from lib.photo.fs_interactions import find_photo

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
          "extension": 1,
          "user": {"$toString": "$user"},
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
    # TODO add watermark check here
    result["photoStr"] = find_photo(f"{result['id']}_t{result['extension']}")
  return res