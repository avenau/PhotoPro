from lib.collection.collection import Collection
from lib.user.user import User
from lib.photo.photo import Photo
from bson.json_util import dumps
from json import loads

from lib.photo.fs_interactions import find_photo

def user_search(data):
  res = User.objects().aggregate(
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

def photo_search(data):
  res = Photo.objects().aggregate(
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

def collection_search(data):
  res = Collection.objects().aggregate(
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