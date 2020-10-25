"""
Create and modify photos which are uploaded by a user

"""
import base64
import datetime
from bson.objectid import ObjectId


from lib.photo.validate_photo import validate_photo, validate_photo_user, reformat_lists
from ..token_functions import get_uid


def create_photo_entry(mongo, photo_details):
    """
    Creates photo entry in photo collection and adds photo/post in the user collection

    """

    photo_details = reformat_lists(photo_details)
    validate_photo(photo_details)

    # Get photo values before popping them
    base64_str = photo_details['photo']
    extension = photo_details['extension']
    photo_details.pop("photo")
    photo_details.pop("extension")

    # Insert photo entry, except "path" attribute
    user_uid = get_uid(photo_details['token'])

    default = {
        "metadata": base64_str.split(',')[0] + ',',
        "discount": 0.0,
        "posted": datetime.datetime.now(),
        "user": ObjectId(user_uid),
        "likes": 0,
        "comments": ["TODO"],
        "won": "TODO",
    }
    photo_details.update(default)
    photo_entry = mongo.db.photos.insert_one(photo_details)
    
    # Process photo and upload
    photo_oid = photo_entry.inserted_id
    name = str(photo_oid)
    path = process_photo(base64_str, name, extension)

    # Add "path" attribute to db entry
    query = {"_id": ObjectId(name)}
    set_path = {"$set": {"pathToImg": path}}
    mongo.db.photos.update_one(query, set_path)
    
    response = mongo.db.users.find_one({"_id": ObjectId(user_uid)}, {"posts": 1})
    posts = response["posts"]
    print("post malone", posts)
    posts.append(ObjectId(name))

    # Where id matches user_uid, replace posts with new posts
    mongo.db.users.update_one({"_id": user_uid}, {"$set": {"posts": posts}})
    return {
        "success": "true"
    }
    
def process_photo(base64_str, name, extension):
    """
    Process base64 str of a photo, convert and save/upload file
    TODO add flag to upload photo to server

    @param base64_str: raw base64 str
    @param name: name of photo
    @param extension: photo type
    @returns: path to photo
    """

    # Remove metadata from b64
    img_data = base64.b64decode(base64_str.split(',')[1])

    path = save_photo_dir(img_data, name, extension)

    return path

def save_photo_dir(img_data, name, extension):
    """
    Save the photo to local directory
    @param img_data: decoded base 64 image
    @param name: name of photo
    @param extension: photo type
    @returns: path to photo
    """
    # Set image path to ./backend/images/'xxxxxx.extension'
    folder = './backend/images/'
    file_name = name + extension
    path = folder + file_name

    # Save image to /backend/images directory
    with open(path, 'wb') as f:
        f.write(img_data)

    return path


# Update details of a photo object
def update_photo_details(mongo, photo_details):
    """
    Update photo details in the database, validates photo details
    @param mongo(object): Mongo databse
    @param photo_details(object): object containing values to change
    @returns: response body
    """
    modify = ["title", "price", "tags", "albums"]

    photo_details = reformat_lists(photo_details)
    validate_photo(photo_details)

    user_uid = get_uid(photo_details['token'])
    # Get the photo object id
    photoId = photo_details["photoId"]
    validate_photo_user(mongo, photoId, user_uid)

    print("update")
    print(photo_details)
    print(photoId)

    for i in modify:
        print('update', i)
        print(photo_details[i])
        mongo.db.photos.update_one({"_id": photoId}, {"$set": {i: photo_details[i]}})
    
    return {
        "success": "true"
    }