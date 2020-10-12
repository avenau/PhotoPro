'''
Error Handling Methods
Access Error: Error when user cannot access an item
ValueError: Error with the content given
'''

from werkzeug.exceptions import HTTPException


class AccessError(HTTPException):
    '''
    AccessError: Error when user cannot access an item
    '''
    code = 400
    message = 'No message specified'


class ValueError(HTTPException):
    '''
    ValueError: Error with the content given
    '''
    code = 400
    message = 'No message specified'
