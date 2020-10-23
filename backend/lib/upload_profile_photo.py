'''
Create a thumbnail of an image, convert it to base64 and attach
it to the user
and validate photo details
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
        thumbnail = base64.b64encode(image_file.read()).decode('utf-8')
    # attach to the user
    user['profile_pic'] = thumbnail
    return user


