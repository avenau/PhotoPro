import os


PORT = os.getenv("BACKEND_PORT")
BACKEND_PATH = 'static/'
FRONTEND_PATH = 'http://localhost:' + str(PORT) + '/static/'


def get_popular_contributors_images():
    return (FRONTEND_PATH + 'contributor1.png',
            FRONTEND_PATH + 'contributor2.png')