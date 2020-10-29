"""
Create and modify photos which are uploaded by a user

"""
import base64
import datetime
from bson.objectid import ObjectId
from PIL import Image
from io import BytesIO


from lib.photo.validate_photo import validate_photo, validate_photo_user, reformat_lists, validate_extension, validate_discount
from ..token_functions import get_uid
from lib.photo.fs_interactions import save_photo


def create_photo_entry(mongo, photo_details):
    """
    Creates photo entry in photo collection and adds photo/post in the user collection

    """

    photo_details = reformat_lists(photo_details)
    validate_photo(photo_details)
    validate_extension(photo_details["extension"])

    # Get photo values before popping them
    base64_str = photo_details['photo'].split(',')[1]
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
    process_photo(base64_str, name, extension)

    # ------ No need to include path in DB --------
    # Add "path" attribute to db entry
    # query = {"_id": ObjectId(name)}
    # set_path = {"$set": {"path": path, "pathThumb": path_thumbnail}}
    # mongo.db.photos.update_one(query, set_path)


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

    @param base64_str: raw base64 str
    @param name: name of photo
    @param extension: photo type
    @returns: path to photo
    """

    filename = name + extension
    save_photo(base64_str, filename)

    # Attach compressed thumbnail to photos
    if extension != ".svg":
        filename_thumbnail = name + "_t" + extension
        img_data = base64.b64decode(base64_str)
        thumb = Image.open(BytesIO(img_data))
        thumb.thumbnail((300, 200))
        buffer = BytesIO()
        thumb.save(buffer, thumb.format)
        save_photo(base64.b64encode(buffer.getvalue()).decode("utf-8"), filename_thumbnail)



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