"""
Create and modify photos which are uploaded by a user

"""
import base64
import datetime

from lib.validate_photo_details import validate_photo, validate_photo_user
import lib.token_functions


def create_photo_entry(mongo, photo_details):
    photo_details = reformat_lists(photo_details)
    validate_photo(photo_details)

    # Get photo values before popping them
    base64_str = photo_details['photo']
    extension = photo_details['extension']
    photo_details.pop("photo")
    photo_details.pop("extension")

    # Insert photo entry, except "path" attribute
    user_uid = token_functions.get_uid(photo_details['token'])
    default = {
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

    save_photo_dir(img_data, name, extension)

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

    user_uid = token_functions.get_uid(photo_details['token'])
    # Get the photo object id
    photo = photo_details["photo"]
    validate_photo_user(mongo, photo, user_uid)

    # Parameters which may be modified
    photoId = photo_details("photo")

    for i in modify:
        mongo.db.photos.update({"_id": photoId}, {"$set": {i: photo_details[i]}})
    
    return {
        "success": "true"
    }