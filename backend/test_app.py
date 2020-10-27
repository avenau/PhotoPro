"""
Set up a test file for the flask app
Test responses to and fro PhotoPro

"""


import os
import pytest

from app import app


@pytest.fixture
def client():
    with app.test_client() as client:

    with flaskr.app.test_client() as client:
        with flaskr.app.app_context():
            flaskr.init_db()
        yield client

    os.close(db_fd)
    os.unlink(flaskr.app.config['DATABASE'])