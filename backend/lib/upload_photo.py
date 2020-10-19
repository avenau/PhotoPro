'''
Create a thumbnail of an image, convert it to base64 and attach
it to the user
'''

import base64
from PIL import Image


def create_thumbnail(image_path):
    '''
    Create the thumbnail using PIL
    @param image_path:string Original loction of the image
    '''
    try:
        image = Image.open(image_path)
        image.thumbnail((90, 90))
    except IOError:
        print("Couldn't find the file")
    return image


def upload_user_photo(user, image_path):
    '''
    Create the thumbnail, convert it to base64 and add to user
    @param user:object Retrieved from the database
    @param image_path:string Original path of the image
    @return user:object with the new thumbnail path
    '''
    # create thumbnail
    # thumbnail = create_thumbnail(image_path)
    with open(image_path, "rb") as image_file:
        # convert to base64
        data = image_file.read()
        thumbnail = base64.b64encode(data)
    # attach to the user
    user['profile_pic'] = thumbnail
    return user


if __name__ == '__main__':
    html = '''
    <img src = "data:image/png;
    base64,
    '''
    user = {
        'profile_pic': None
    }
    user = upload_user_photo(user, 'static/contributor2.png')
    binary = user['profile_pic']
    html = html + binary + '" />'
    f = open('img.html', 'a')
    f.write(html)
    f.close()
