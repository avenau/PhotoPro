'''
Testing the upload photo function
'''
from upload_photo import upload_user_photo

user_one = {
    'fname': 'Joe',
    'lname': 'Aczel',
    'profile_pic': None
}

if __name__ == '__main__':
    new_user = upload_user_photo(user_one, './RPi.png')
    assert new_user['profile_pic'] is not None

