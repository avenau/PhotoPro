'''
Remove a photo from the database
'''

from ..Error import DatabaseError


def remove_photo(photos, identifier):
    '''
    Main function
    '''
    photo = remove_photo(photos, identifier)
    if photo is None:
        print("Couldn't find photo with identifier", identifier)
        raise DatabaseError("Couldn't find photo with identifier", identifier)

    if photos.count_documents(identifier) > 0:
        raise DatabaseError("Document", identifier, "still exists.")


def find_photo(photos, identifier):
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
    Return a single photo on success, None or failure or multiple
    '''
    try:
        photo = photos.find_one_and_delete(identifier)
    except DatabaseError:
        print("Database find_one_and_delete failed")
        raise DatabaseError("Database find_one_and_delete failed")

    return photo
