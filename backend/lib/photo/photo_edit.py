"""
Create and modify photos which are uploaded by a user

"""
import base64
import datetime
from io import BytesIO
from bson.objectid import ObjectId
from PIL import Image, ImageSequence, ImageDraw, ImageFont
from io import BytesIO
import cairosvg


from lib.photo.validate_photo import validate_photo
from lib.photo.validate_photo import validate_photo_user
from lib.photo.validate_photo import reformat_lists
from lib.photo.validate_photo import validate_extension
from lib.photo.validate_photo import validate_discount
from lib.token_functions import get_uid
from lib.photo.fs_interactions import find_photo, save_photo


def create_photo_entry(mongo, photo_details):
    """
    Creates photo entry in photo collection and adds
    photo/post in the user collection
    """

    photo_details = reformat_lists(photo_details)
    validate_photo(photo_details)
    validate_extension(photo_details["extension"])

    # Get photo values before popping them
    [metadata, base64_str] = photo_details['photo'].split(',')
    extension = photo_details['extension']
    photo_details.pop("photo")

    # Insert photo entry, except "path" attribute
    user_uid = get_uid(photo_details['token'])
    photo_details.pop("token")

    default = {
        "metadata": f"{metadata},",
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
    try:
        process_photo(base64_str, name, extension)

        # Add photo to user's posts
        response = mongo.db.users.find_one({"_id": ObjectId(user_uid)},
                                           {"posts": 1})
        posts = response["posts"]
        posts.append(ObjectId(name))
        mongo.db.users.update_one({"_id": ObjectId(user_uid)},
                                  {"$set": {"posts": posts}})
        return {
            "success": "true"
        }
    except Exception as e:
        mongo.db.photos.delete_one({"_id": photo_oid})
        print("Didn't add photo to DB because:")
        print(e)
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

def get_photo_edit(mongo, photoId, token):
    """
    Get photo details from the database,
        validates if user is authorised to edit the photo
    @param mongo(object): Mongo databse
    @param photoId: str
    @param token: str
    @returns: response body
    """
    user_uid = get_uid(token)
    validate_photo_user(mongo, photoId, user_uid)

    result = mongo.db.photos.find_one({"_id": ObjectId(photoId)})

    # Get image from FS API
    img = find_photo(f"{photoId}{result['extension']}")

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
        mongo.db.photos.update({"_id": ObjectId(photoId)},
                               {"$set": {i: photo_details[i]}})

    return {
        "success": "true"
    }
