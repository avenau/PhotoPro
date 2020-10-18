import os


PORT = os.getenv("BACKEND_PORT")
FRONTEND_PATH = 'http://localhost:' + str(PORT) + '/static/'


def get_popular_images():
    return (FRONTEND_PATH + 'logo.svg',
            FRONTEND_PATH + 'logo.svg',
            FRONTEND_PATH + 'logo.svg')
