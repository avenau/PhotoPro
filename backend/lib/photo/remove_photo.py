'''
Remove a photo from the database
Checks to see if the user is a valid user to delete the photo
Future Updates: Allow for admin users to delete a photo

@author Jaczel
@updated 23/10/2020
'''

import traceback
import os
import lib.Error as Error
import lib.photo.photo

PHOTO_DIRECTORY = ''


def remove_photo(u_id, identifier):
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
    photo = lib.photo.photo.Photo.objects.get(id=identifier)
    if not photo:
        raise Error.PhotoDNE("Couldn't find requested photo")
    if str(photo.get_user()) != u_id:
        raise PermissionError("User does not have permission to edit")

    # Delete the photo, database handles the rest
    photo.delete_photo()
    try:
        photo.save()
    except Exception:
        print(traceback.format_exc())
        raise Error.ValidationError("Could not delete photo")
    # TODO: Do we need to remove the photo from the directory?

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
    except Error.DatabaseError:
        print("Database find_one_and_delete failed")
        raise Error.DatabaseError("Database find_one_and_delete failed")

    print(res.modified_count)

    return res.modified_count > 0


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
