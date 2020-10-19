'''
Create a thumbnail of an image, convert it to base64 and attach
it to the user
'''

import os
import shutil
from base64 import b64encode
import requests
from PIL import Image


def get_image_from_url(image_url, file_path):
    '''
    Download an image from a url
    '''
    resp = requests.get(image_url, stream=True)
    local_file = open(file_path, 'wb')
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
            with Image.open(infile) as im:
                im.thumbnail(size)
                im.save(outfile, file_type)
        except OSError:
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
    TODO:
        - determine the file type based on final 3 chars
        OR
        - determine based on the http requests response
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
        raise ValueError("Image is not of correct format")

    return res


def cleanup_files(files):
    '''
    Cleanup the temp files that are made
    '''
    for file_path in files:
        if os.path.exists(file_path):
            os.remove(file_path)


def update_user_thumbnail(url_path):
    '''
    MAIN CALLABALE FUNCTION
    TODO:
        - store in the database or object
    '''
    file_path = './temp'
    thumbnail_file_path = file_path + '.thumbnail'
    size = (90, 90)
    file_type = ''

    response_content_type = get_image_from_url(url_path, file_path)
    file_type = determine_file_type(response_content_type)
    thumbnail_file_path = create_thumbnail(file_path, size, file_type)
    b64 = convert_to_base64(thumbnail_file_path)
    cleanup_files([file_path, thumbnail_file_path])
    return b64
    # store in the database?
    # user['profile_pic'] = b64
    # return user


def test_thumbnail_functions():
    '''
    Simple testing function
    '''
    # Static variables
    size = (90, 90)
    file_path = './img.png'
    image_url = 'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png'
    file_type = ("JPEG", "PNG", "SVG")

    get_image_from_url(image_url, file_path)
    f = create_thumbnail(file_path, size, file_type[1])
    b64 = convert_to_base64(f)
    write_to_html('out.html', b64)


def test_main_function():
    '''
    Tests the main update_user_thumbnail function
    '''
    path = 'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png'
    print(update_user_thumbnail(path))
