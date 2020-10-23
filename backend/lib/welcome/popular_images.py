import os
from port import BACKEND_PORT

FRONTEND_PATH = 'http://localhost:' + str(BACKEND_PORT) + '/static/'


def get_popular_images():
    return (FRONTEND_PATH + 'logo.svg',
            FRONTEND_PATH + 'logo.svg',
            FRONTEND_PATH + 'logo.svg')
