"""
Create and modify photos which are uploaded by a user

"""
import json
import base64
import datetime
import traceback
from io import BytesIO
import mongoengine
from bson.objectid import ObjectId
from PIL import Image, ImageSequence, ImageDraw, ImageFont
import cairosvg

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
        metadata = metadata + ",",
        extension = extension,
        posted = datetime.datetime.now()
    )
    new_photo.save()
    new_photo.set_albums(photo_details["albums"])
    try:
        process_photo(base64_str, str(new_photo.get_id()), extension)
        user.add_post(new_photo)
        user.save()
        return {
            "success": "true"
        }
    except Exception as e:
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
    img_data = base64.b64decode(base64_str)
    save_photo(img_data, filename)
    filename_thumbnail = name + "_t" + extension

    # Watermarking and thumbnailing
    if extension != ".svg":
        make_watermarked_copy(img_data, name, extension)
        thumb_img_data = make_thumbnail(img_data, filename_thumbnail)
        make_watermarked_copy(thumb_img_data, name + "_t", extension)
    elif extension == ".svg":
        thumb_img_data = make_thumbnail_svg(img_data, name)
        make_watermarked_copy(thumb_img_data, name + "_t", ".png")

def make_thumbnail(img_data, filename_thumbnail):
    '''
    Make a thumbnail from the image data
    @param img_data: bytestring
    @param filename_thumbnail : string
    '''
    thumb = Image.open(BytesIO(img_data))
    thumb.thumbnail((300, 200))
    buffer = BytesIO()
    thumb.save(buffer, thumb.format)
    save_photo(buffer.getvalue(), filename_thumbnail)
    return buffer.getvalue()

def make_thumbnail_svg(img_data, name):
    '''
    Convert svg to png for thumbnail purposes.
    '''
    filename_thumbnail = name + "_t.png"
    png_bytes = cairosvg.svg2png(img_data)
    # This shouldn't really be done in this function
    # Change if time (Allan)
    make_watermarked_copy(png_bytes, name, ".png")
    png_version = Image.open(BytesIO(png_bytes))
    buf = BytesIO()
    png_version.save(buf, png_version.format)
    return make_thumbnail(buf.getvalue(), filename_thumbnail)

def make_watermarked_copy(img_data, name, extension):
    '''
    Make watermarked copy of png and jpg images.

    Thumbnail before watermark.

    Do not pass an svg directly to this function.
    '''
    watermarked_filename = name + "_w" + extension
    img = Image.open(BytesIO(img_data))

    img_width, img_height = img.size
    x_quarter = img_width*0.25
    y_middle = img_height*0.5
    draw = ImageDraw.Draw(img)
    medium_grey = (192,192,192)
    # Write "PhotoPro (c)" in grey
    # Size determined via experimentation
    font_size = max([1, int(img_width/11)])
    font = ImageFont.truetype('josefin-sans/JosefinSans-Regular.ttf', size=font_size)
    draw.text((x_quarter, y_middle), "PhotoPro (c)", font=font, fill=medium_grey)

    watermarked_img_buf = BytesIO()
    img.save(watermarked_img_buf, format=img.format)
    save_photo(watermarked_img_buf.getvalue(), watermarked_filename)

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

    albums = list()

    for i in photo.get_albums():
        albums.append(str(i.id))

    print(albums)

    return {
        "title": photo.get_title(),
        "price": photo.get_price(),
        "tags": photo.get_tags(),
        "albums": albums,
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
    if user_uid != str(photo.get_user().get_id()):
        raise PermissionError("User does not have permission to edit photo")

    photo.set_title(photo_details['title'])
    photo.set_price(int(photo_details['price']))
    photo.add_tags(photo_details['tags'])
    photo.set_albums(photo_details['albums'])
    photo.set_discount(int(photo_details['discount']))

    # Save the photo
    try:

        photo.save()
        print('saved')
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not update photo")

    return {
        "success": "true"
    }

def reformat_lists(photo_details):
    '''
    1) Lower case for tags
    2) Convert JSON album list to python
    '''
    photo_details = lower_tags(photo_details)
    photo_details = convert_album_list(photo_details)
    return photo_details


def lower_tags(photo_details):
    '''
    Convert tags to lowercase
    '''
    tags = photo_details["tags"]
    if not isinstance(tags, list):
        tags = json.loads(tags)

    photo_details.pop("tags")
    tags = [i.lower() for i in tags]
    photo_details.update({"tags": tags})
    return photo_details

def convert_album_list(photo_details):
    """
    Convert JSON album list to python
    """
    albums = photo_details["albums"]
    if not isinstance(albums, list):
        albums = json.loads(albums)
    photo_details["albums"] = albums
    return photo_details
