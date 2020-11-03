"""
Create and modify photos which are uploaded by a user

"""
import base64
import datetime
import traceback
from io import BytesIO
import mongoengine
from bson.objectid import ObjectId
from PIL import Image, ImageSequence


from lib.photo.validate_photo import validate_photo
from lib.photo.validate_photo import validate_photo_user
from lib.photo.validate_photo import reformat_lists
from lib.photo.validate_photo import validate_extension
from lib.photo.validate_photo import validate_discount
from lib.token_functions import get_uid
from lib.photo.fs_interactions import find_photo, save_photo
import lib.Error as Error
import lib.photo.photo
import lib.user.user


def create_photo_entry(photo_details):
    """
    Creates photo entry in photo collection and adds
    photo/post in the user collection
    """

    photo_details = reformat_lists(photo_details)

    # Get photo values before popping them
    [metadata, base64_str] = photo_details['photo'].split(',')
    extension = photo_details['extension']

    # Insert photo entry, except "path" attribute
    user_uid = get_uid(photo_details['token'])
    user = lib.user.user.User.objects.get(id=user_uid)
    if not user:
        raise Error.UserDNE("Could not find User " + user_uid)

    # Create a new photo
    new_photo = lib.photo.photo.Photo(
        title = photo_details['title'],
        price = photo_details['price'],
        user = user,
        tags = photo_details['tags'],
    )
    new_photo.save()

    # Process photo and upload
    photo_oid = new_photo.id
    name = str(photo_oid)
    try:
        process_photo(base64_str, name, extension)

        # Add photo to user's posts
        user.add_post(new_photo)
        user.save()
        return {
            "success": "true"
        }
    except:
        return {
            "success": "false"
        }


def process_photo(base64_str, name, extension):
    """
    Process base64 str of a photo, convert and save/upload file

    @param base64_str: raw base64 str
    @param name: name of photo
    @param extension: photo type
    """

    filename = name + extension
    save_photo(base64_str, filename)
    filename_thumbnail = name + "_t" + extension

    # Attach compressed thumbnail to photos
    if not extension in [".svg", ".gif"]:
        make_thumbnail(base64_str, filename_thumbnail)
    if extension == ".gif":
        make_thumbnail_gif(base64_str, filename_thumbnail)


def make_thumbnail(base64_str, filename_thumbnail):
    '''
    Make a thumbnail from the base64 string
    @param base64_str: string
    @param filename_thumbnail : string
    '''
    img_data = base64.b64decode(base64_str)
    thumb = Image.open(BytesIO(img_data))
    thumb.thumbnail((300, 200))
    buffer = BytesIO()
    thumb.save(buffer, thumb.format)
    save_photo(base64.b64encode(buffer.getvalue()).decode("utf-8"), filename_thumbnail)

def make_thumbnail_gif(base64_str, filename_thumbnail):
    '''
    Make a thumbnail out of a gif
    @param base64_str: string
    @param filename_thumbnail : string
    '''
    # Resize each frame in thumbnail
    img_data = base64.b64decode(base64_str)
    thumb = Image.open(BytesIO(img_data))
    frames = [frame.copy() for frame in ImageSequence.Iterator(thumb)]
    for frame in frames:
        frame.thumbnail((300, 200))

    # Save thumbnail
    out = frames[0]
    out.info = thumb.info
    buffer = BytesIO()
    out.save(buffer, format=thumb.format, save_all=True, append_images=frames[1:], loop=0)
    save_photo(base64.b64encode(buffer.getvalue()).decode("utf-8"), filename_thumbnail)


def get_photo_edit(photo_id, token):
    """
    Get photo details from the database,
        validates if user is authorised to edit the photo
    @param mongo(object): Mongo databse
    @param photoId: str
    @param token: str
    @returns: response body
    """
    user_uid = get_uid(token)
    photo = lib.photo.photo.Photo.objects.get(id=photo_id)
    if str(photo.get_user().id) != user_uid:
        raise PermissionError("User is not able to edit this photo")
    extension = photo.get_extension()
    # Get image from FS API
    img = find_photo(f"{photo_id}{extension}")

    return {
        "title": photo.get_title(),
        "price": photo.get_price(),
        "tags": photo.get_tags(),
        "albums": photo.get_albums(),
        "discount": photo.get_discount(),
        "photoStr": img,
        "metadata": photo.get_metadata(),
        "deleted": photo.is_deleted()
    }


# Update details of a photo object
def update_photo_details(photo_details):
    """
    Update photo details in the database, validates photo details
    modifable_categories = ["title", "price", "tags", "albums", "discount"]
    @param mongo(object): Mongo databse
    @param photo_details(object): object containing values to change
    @returns: response body
    """

    photo_details = reformat_lists(photo_details)

    # Get the User's id
    user_uid = get_uid(photo_details['token'])
    # Get the photo
    photo = lib.photo.photo.Photo.objects.get(id=photo_details['photoId'])

    # Check the user has permission to edit the photo
    if user_uid != str(photo.get_user()):
        raise PermissionError("User does not have permission to edit photo")


    photo.set_title(photo_details['title'])
    photo.set_price(photo_details['price'])
    photo.set_tags(photo_details['tags'])
    photo.set_albums(photo_details['albums'])
    photo.set_discount(photo_details['discount'])

    # Save the photo
    try:
        photo.save()
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not update photo")

    return {
        "success": "true"
    }
