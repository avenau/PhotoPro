"""
Create and modify photos which are uploaded by a user

"""
import base64
import datetime
import traceback
from io import BytesIO
import mongoengine
from bson.objectid import ObjectId
from PIL import Image, ImageSequence, ImageDraw
import cairosvg


from lib.photo.validate_photo import reformat_lists
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
        extension = extension
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
    img_data = base64.b64decode(base64_str)
    save_photo(img_data, filename)
    filename_thumbnail = name + "_t" + extension

    # Watermarking and thumbnailing
    if not extension in [".svg", ".gif"]:
        make_watermarked_copy(img_data, name, extension)
        thumb_img_data = make_thumbnail(img_data, filename_thumbnail)
        make_watermarked_copy(thumb_img_data, name + "_t", extension)
    elif extension == ".svg":
        thumb_img_data = make_thumbnail_svg(img_data, name)
        make_watermarked_copy(thumb_img_data, name + "_t", ".png")
    elif extension == ".gif":
        make_thumbnail_gif(img_data, filename_thumbnail)

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

def make_thumbnail_gif(img_data, filename_thumbnail):
    '''
    Make a thumbnail out of a gif
    @param img_data: bytestring
    @param filename_thumbnail : string
    '''
    # Resize each frame in thumbnail
    thumb = Image.open(BytesIO(img_data))
    frames = [frame.copy() for frame in ImageSequence.Iterator(thumb)]
    for frame in frames:
        frame.thumbnail((300, 200))

    # Save thumbnail
    out = frames[0]
    out.info = thumb.info
    buffer = BytesIO()
    out.save(buffer, format=thumb.format, save_all=True, append_images=frames[1:], loop=0)
    save_photo(buffer.getvalue(), filename_thumbnail)

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

    Do not pass an svg or gif directly to this function.
    '''
    watermarked_filename = name + "_w" + extension
    img = Image.open(BytesIO(img_data))
    img_width, img_height = img.size

    # Height and width coords for drawing watermark
    coord_ratios = [0.1, 0.25, 0.75, 0.9]
    w = [img_width*r for r in coord_ratios] # left to right
    h = [img_height*r for r in coord_ratios] # top to bottom

    draw = ImageDraw.Draw(img)
    # Draw some rectangles and lines
    black = (0,0,0)
    red = (255, 0, 0)
    green = (0, 255, 0)
    blue = (0, 0, 255)
    thickness = max([1, int(img_height/100)])
    draw.rectangle([w[0], h[0], w[3], h[3]], width=thickness, outline=black)
    draw.rectangle([w[1], h[1], w[2], h[2]], width=thickness, outline=green)
    draw.line([w[0], h[0], w[3], h[3]], width=thickness, fill=red)
    draw.line([w[3], h[0], w[0], h[3]], width=thickness, fill=blue)

    # Write "PhotoPro (c)" in red
    watermark_text = "PhotoPro (c)"
    # Following line only works on windows. May need to specify absolute path to font.
    # font_size = max([1, int(img_height/20)])
    # font = ImageFont.truetype('arial.ttf', size=font_size)
    draw.text((w[1], h[0]), watermark_text, fill=red)

    watermarked_img_buf = BytesIO()
    img.save(watermarked_img_buf, format=img.format)
    save_photo(watermarked_img_buf.getvalue(), watermarked_filename)

# TODO: (Allan) DOES NOT WORK
"""
def make_watermarked_copy_gif(img_data, name):
    '''
    Make watermarked copy of gif.

    Thumbnail before watermark.

    Only pass gifs to this function.
    '''
    watermarked_filename = name + "_w.gif"

    img = Image.open(BytesIO(img_data))
    img_width, img_height = img.size

    # Height and width coords for drawing watermark
    coord_ratios = [0.1, 0.25, 0.75, 0.9]
    w = [img_width*r for r in coord_ratios] # left to right
    h = [img_height*r for r in coord_ratios] # top to bottom
    black = (0,0,0)
    red = (255, 0, 0)
    green = (0, 255, 0)
    blue = (0, 0, 255)
    thickness = max([1, int(img_height/100)])
    frames = [frame.copy() for frame in ImageSequence.Iterator(img)]
    for frame in frames:
        draw = ImageDraw.Draw(frame)
        # Draw some rectangles and lines
        draw.rectangle([w[0], h[0], w[3], h[3]], width=thickness, outline=black)
        draw.rectangle([w[1], h[1], w[2], h[2]], width=thickness, outline=green)
        draw.line([w[0], h[0], w[3], h[3]], width=thickness, fill=red)
        draw.line([w[3], h[0], w[0], h[3]], width=thickness, fill=blue)
        # Write "PhotoPro (c)" in red
        watermark_text = "PhotoPro (c)"
        # Following line only works on windows. May need to specify absolute path to font.
        # font_size = max([1, int(img_height/20)])
        # font = ImageFont.truetype('arial.ttf', size=font_size)
        draw.text((w[1], h[0]), watermark_text, fill=red)

    out = frames[0]
    out.info = img.info
    buf = BytesIO()
    out.save(buf, format=img.format, save_all=True, append_images=frames[1:], loop=0)
    save_photo(base64.b64encode(buf.getvalue()).decode("utf-8"), watermarked_filename)
"""

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
    print("user id", user_uid)
    # Get the photo
    photo = lib.photo.photo.Photo.objects.get(id=photo_details['photoId'])
    print("user on sys", photo.get_user().get_id())
    # Check the user has permission to edit the photo
    if user_uid != str(photo.get_user().get_id()):
        raise PermissionError("User does not have permission to edit photo")

    price = photo_details['price']
    price = int(price)


    photo.set_title(photo_details['title'])
    photo.set_price(price)
    photo.add_tags(photo_details['tags'])
    photo.set_albums(photo_details['albums'])
    photo.set_discount(int(photo_details['discount']))

    # Save the photo
    try:
        photo.save()
    except mongoengine.ValidationError:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not update photo")

    return {
        "success": "true"
    }
