'''
Create a thumbnail of an image, convert it to base64 and attach
it to the user
'''

import os
import shutil
from base64 import b64encode
import requests
from PIL import Image


# Globals
FILES = []
FILE_PATH = './temp'
THUMBNAIL_FILE_PATH = FILE_PATH + '.thumbnail'
FILES.append(FILE_PATH)
FILES.append(THUMBNAIL_FILE_PATH)


def get_image_from_url(image_url):
    '''
    Download an image from a url
    '''
    resp = requests.get(image_url, stream=True)
    local_file = open(FILE_PATH, 'wb')
    # Set decode_content value to True,
    file_type = resp.headers.get('Content-Type')
    # otherwise the downloaded image file's size will be zero.
    resp.raw.decode_content = True
    # Copy the response stream raw data to local image file
    shutil.copyfileobj(resp.raw, local_file)
    del resp
    return file_type


def create_thumbnail(infile, size, file_type):
    '''
    Create a thumbnail from a file
    Accepts PNG, JPEG and SVG
    '''
    outfile = os.path.splitext(infile)[0] + ".thumbnail"
    if infile != outfile:
        try:
            with Image.open(infile) as img:
                img.thumbnail(size)
                img.save(outfile, file_type)
        except OSError:
            cleanup_files()
            print("cannot create thumbnail for", infile)
    return outfile


def convert_to_base64(infile):
    '''
    Convert to base64 string
    @return b64 string
    '''
    with open(infile, "rb") as img_file:
        return b64encode(img_file.read()).decode('utf-8')


def write_to_html(html_file_path, b64):
    '''
    Write the file to an html file
    Used for testing
    '''
    start_img_tag = '''<img src="data:image/jpeg;base64,'''
    close_img_tag = '''"/>'''
    html = start_img_tag + b64 + close_img_tag
    html_file = open(html_file_path, 'w')
    html_file.write(html)
    html_file.close()


def determine_file_type(response_content_type):
    '''
    Determine the file type based on the return of the request
    '''
    res = ''
    if response_content_type == 'image/png':
        res = 'PNG'
    elif response_content_type == 'image/jpg':
        res = 'JPEG'
    elif response_content_type == 'image/jpeg':
        res = 'JPEG'
    elif response_content_type == 'image/svg':
        res = 'SVG'
    else:
        print("Image is not of correct format")
        cleanup_files()
        raise ValueError("Image is not of correct format")

    return res


def cleanup_files():
    '''
    Cleanup the temp files that are made
    '''
    for local_file_path in FILES:
        if os.path.exists(local_file_path):
            os.remove(local_file_path)


def update_user_thumbnail(url_path):
    '''
    MAIN CALLABALE FUNCTION
    TODO:
        - store in the database or object
    '''
    size = (150, 150)
    file_type = ''

    response_content_type = get_image_from_url(url_path)
    file_type = determine_file_type(response_content_type)
    create_thumbnail(FILE_PATH, size, file_type)
    b64 = convert_to_base64(FILE_PATH)
    cleanup_files()
    return (b64, file_type)
