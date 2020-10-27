'''
Remove a photo from the database
Checks to see if the user is a valid user to delete the photo
Future Updates: Allow for admin users to delete a photo

@author Jaczel
@updated 23/10/2020
'''

from ..Error import DatabaseError
import os

PHOTO_DIRECTORY = ''


def remove_photo(photos, u_id, identifier):
    '''
    Description
    -----------
    Remove a photo from the database if the user is authorised

    Parameters
    ----------
    photos: pymongo.collection
    u_id: string
    identifier: dictionary
        e.g. {'title': 'Best jpeg'}

    Returns
    -------
    True on Success, False otherwise

    '''
    # Get the photo object
    try:
        photo = get_photo(photos, identifier)
    except DatabaseError:
        print("Could not find photo", identifier)
        raise DatabaseError("Could not find photo")

    if photo is None:
        print("Couldn't find photo", identifier)
        # raise DatabaseError("Could not find photo", identifier)
        return False
    # Check the user is authorised to delete the photo
    if not is_authorised(u_id, photo):
        return False

    # Remove photo fromthe DatabaseError
    if remove_photo_from_db(photos, identifier) is False:
        print("Photo already deleted")
    '''
    TODO: Remove the photo from the directory structure
    # Remove the photo from the file system
    if remove_photo_from_directory(photo['pathToImg']) is not True:
        raise FileExistsError("Couldn't find photo")
    '''

    # Return True on success
    return True


def is_authorised(u_id, photo):
    '''
    Check the user is the owner of the photo
    Future update: allow for admin access
    '''
    if u_id == str(photo['user']):
        return True
    return False


def get_photo(photos, identifier):
    '''
    Return the photo object
    '''
    return photos.find_one(identifier)


def remove_photo_from_db(photos, identifier):
    '''
    Description
    -----------
    Search for a photo and return it

    Parameters
    ----------
    photos: object
        the pymongo photos collection
    identifier: dict
        e.g. {_id: string} or {title: string}

    Returns
    -------
    Return True if one or more photos were modified
    '''
    try:
        res = photos.update_one(identifier, {
                                                '$set': {'deleted': True}
                                               })
    except DatabaseError:
        print("Database find_one_and_delete failed")
        raise DatabaseError("Database find_one_and_delete failed")

    print(res.modified_count)

    return True if res.modified_count > 0 else False


def remove_photo_from_directory(photo_path):
    '''
    Description
    -----------
    Remove the photo from the server

    Parameters
    ----------
    photo_path: string

    Returns
    -------
    True on success, otherwise False
    '''
    photo_path = PHOTO_DIRECTORY + photo_path
    if os.path.exists(photo_path):
        os.remove(photo_path)
        return True

    return False
