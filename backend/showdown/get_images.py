import os


PORT = os.getenv("BACKEND_PORT")
BACKEND_PATH = 'static/'
FRONTEND_PATH = 'http://localhost:' + str(PORT) + '/static/'


def get_images():
    print(os.getenv("BACKEND_PORT"))
    return (FRONTEND_PATH + 'apple.png',
            FRONTEND_PATH + 'banana.png')
