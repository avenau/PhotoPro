"""
Get popular contributors from the platform

"""
import os
import mongoengine

PORT = os.getenv("BACKEND_PORT")
BACKEND_PATH = 'static/'
FRONTEND_PATH = 'http://localhost:' + str(PORT) + '/static/'


def get_popular_contributors_images():
    return (FRONTEND_PATH + 'contributor1.png',
            FRONTEND_PATH + 'contributor2.png')

def compute_popular_contributors(artists=3):
    """
    Get top liked artists (default top 3) in the last X hrs 
    """
    pass
