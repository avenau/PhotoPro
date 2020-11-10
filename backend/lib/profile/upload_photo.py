"""
Create a thumbnail of an image, convert it to base64 and attach
it to the user
"""

import os
import shutil
import base64
from PIL import Image


def extension_to_mimetype(extension):
    """
    Return mimetype based on given extension
    """
    mime = ""
    if extension == ".jpg" or extension == ".jpeg":
        mime = "JPEG"
    elif extension == ".png":
        mime = "PNG"
    elif extension == ".svg":
        mime = "SVG+XML"

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

    temp_file = open("temp_thumb_uncompressed" + extension, "wb")
    temp_file.write(img_data)
    temp_file.close()
    thumb = Image.open("temp_thumb_uncompressed" + extension)
    thumb.thumbnail(size)
    thumb.save("temp_thumb_compressed" + extension)
    # Attach the following to db entry
    thumb_b64 = base64.b64encode(
        open("temp_thumb_compressed" + extension, "rb").read()
    ).decode("utf-8")

    os.remove("temp_thumb_uncompressed" + extension)
    os.remove("temp_thumb_compressed" + extension)

    return (thumb_b64, mime)
