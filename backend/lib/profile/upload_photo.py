"""
Create a thumbnail of an image, convert it to base64 and attach
it to the user
"""

from io import BytesIO
import base64
from PIL import Image


def extension_to_mimetype(extension):
    """
    Return mimetype based on given extension

    The extensions within the if statements will get converted
    otherwise return the input.
    """
    mime = ""
    if extension == ".jpg" or extension == ".jpeg":
        mime = "JPEG"
    elif extension == ".png":
        mime = "PNG"
    elif extension == ".svg":
        mime = "SVG+XML"
    else:
        return extension

    return mime


def update_user_thumbnail(base64_image, extension):
    """
    MAIN CALLABALE FUNCTION
    Modified by Allan to take a base64 string as opposed to url
    """
    mime = extension_to_mimetype(extension)
    base64_image = base64_image.split(",")[1]
    # Cannot compress SVG
    if mime == "SVG+XML":
        return (base64_image, mime)

    # Not SVG
    size = (200, 200)
    # Remove metadata then decode
    img_data = base64.b64decode(base64_image)
    thumb = Image.open(BytesIO(img_data))
    thumb.thumbnail(size)
    buf = BytesIO()
    thumb.save(buf, thumb.format)
    thumb_img_data = buf.getvalue()
    thumb_b64 = base64.b64encode(thumb_img_data).decode("utf-8")

    return (thumb_b64, mime)
