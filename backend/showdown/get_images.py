import os


PORT = os.getenv("BACKEND_PORT")
BACKEND_PATH = 'static/'
FRONTEND_PATH = 'http://localhost:' + str(PORT) + '/static/'


def get_images():
    return (FRONTEND_PATH + 'apple.png',
            FRONTEND_PATH + 'banana.png')
