'''
Showdown related functions
'''
import os


PORT = os.getenv("BACKEND_PORT")
BACKEND_PATH = 'static/'
FRONTEND_PATH = 'http://localhost:' + str(PORT) + '/static/'


def get_showdown_competing_photos():
    '''
    TODO: Update this to search the backend
    '''
    return (FRONTEND_PATH + 'apple.png',
            FRONTEND_PATH + 'banana.png')


def get_showdown_winner_image():
    '''
    TODO: Update this to search the backend
    '''
    return (FRONTEND_PATH + 'logo.svg')
