"""
Create and modify photos which are uploaded by a user

"""
import base64
import datetime
from bson.objectid import ObjectId
from PIL import Image


from lib.photo.validate_photo import validate_photo, validate_photo_user, reformat_lists, validate_extension, validate_discount
from ..token_functions import get_uid


def create_photo_entry(mongo, photo_details):
    """
    Creates photo entry in photo collection and adds photo/post in the user collection

    """

    photo_details = reformat_lists(photo_details)
    validate_photo(photo_details)
    validate_extension(photo_details["extension"])

    # Get photo values before popping them
    base64_str = photo_details['photo']
    extension = photo_details['extension']
    photo_details.pop("photo")

    # Insert photo entry, except "path" attribute
    user_uid = get_uid(photo_details['token'])
    photo_details.pop("token")

    default = {
        "metadata": base64_str.split(',')[0] + ',',
        "discount": 0.0,
        "posted": datetime.datetime.now(),
        "user": ObjectId(user_uid),
        "likes": 0,
        "comments": ["TODO"],
        "won": "TODO",
        "deleted": False
    }
    photo_details.update(default)
    photo_entry = mongo.db.photos.insert_one(photo_details)

    # Process photo and upload
    photo_oid = photo_entry.inserted_id
    name = str(photo_oid)
    (path, path_thumbnail) = process_photo(base64_str, name, extension)

    # Add "path" attribute to db entry
    query = {"_id": ObjectId(name)}
    set_path = {"$set": {"path": path, "pathThumb": path_thumbnail}}
    mongo.db.photos.update_one(query, set_path)


    # Add photo to user's posts
    response = mongo.db.users.find_one({"_id": ObjectId(user_uid)}, {"posts": 1})
    posts = response["posts"]
    posts.append(ObjectId(name))
    mongo.db.users.update_one({"_id": ObjectId(user_uid)}, {"$set": {"posts": posts}})
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
    @returns: path to photo, path to thumbnail of photo
    """
    # Set image path to ./backend/images/'xxxxxx.extension'
    folder = './backend/images/'
    file_name = name + extension
    path = folder + file_name
    path_thumbnail = folder + name + "_t" + extension

    # Save image to /backend/images directory
    with open(path, 'wb') as f:
        f.write(img_data)

    # Attach compressed thumbnail to photos
    if extension != ".svg":
        thumb = Image.open(path)
        thumb.thumbnail((150, 150))
        thumb.save(path_thumbnail)
        print("Thumbnail saved to" + path_thumbnail)

    return (path, path_thumbnail)

# Get details about photo
def get_photo_edit(mongo, photoId, token):
    """
    Get photo details from the database, validates if user is authorised to edit the photo
    @param mongo(object): Mongo databse
    @param photoId: str
    @param token: str
    @returns: response body
    """
    user_uid = get_uid(token)
    validate_photo_user(mongo, photoId, user_uid)

    result = mongo.db.photos.find_one({"_id": ObjectId(photoId)})
    print(result)
    # Encode image into
    with open(result["path"], "rb") as f:
        img = f.read()

    img = str(base64.b64encode(img))

    return {
        "title": result["title"],
        "price": result["price"],
        "tags": result["tags"],
        "albums": result["albums"],
        "discount": result["discount"],
        "photoStr": img,
        "metadata": result["metadata"],
        "deleted": result["deleted"]
    }


# Update details of a photo object
def update_photo_details(mongo, photo_details):
    """
    Update photo details in the database, validates photo details
    @param mongo(object): Mongo databse
    @param photo_details(object): object containing values to change
    @returns: response body
    """
    modify = ["title", "price", "tags", "albums", "discount"]

    photo_details = reformat_lists(photo_details)
    validate_photo(photo_details)
    validate_discount(photo_details["discount"])

    user_uid = get_uid(photo_details['token'])
    # Get the photo object id
    photoId = photo_details["photoId"]
    validate_photo_user(mongo, photoId, user_uid)

    for i in modify:
        mongo.db.photos.update({"_id": ObjectId(photoId)}, {"$set": {i: photo_details[i]}})

    return {
        "success": "true"
    }