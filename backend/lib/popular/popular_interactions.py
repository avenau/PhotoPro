"""
Interact with popular db entries
"""

from lib.photo.photo import Photo
from lib.popular.popular_photos import PopularPhoto
from lib.popular.popular_users import PopularUser
from lib.user.user import User


def do_like(user, photo):
    # Get Popular photo and user objects, create them if they don't exit yet
    try:
        pop_photo = PopularPhoto.objects.get(photo=photo)
    except:
        pop_photo = PopularUser(photo=photo, likes=0)
        pop_photo.save()
    try:
        pop_user = PopularUser.objects.get(user=user)
    except:
        pop_user = PopularUser(user=user, likes=0)
        pop_user.save()

    # Add likes to both user and photo
    pop_user.add_like()
    pop_photo.add_like()
    pop_user.save()
    pop_photo.save()


def do_unlike(user, photo):
    # Get Popular photo and user objects, create them if they don't exit yet
    try:
        pop_photo = PopularPhoto.objects.get(photo=photo)
    except:
        pop_photo = PopularPhoto(photo=photo, likes=0)
        pop_photo.save()
    try:
        pop_user = PopularUser.objects.get(user=user)
    except:
        pop_user = PopularUser(user=user, likes=0)
        pop_user.save()

    # Remove likes from both user and photo
    pop_user.remove_like()
    pop_photo.remove_like()
    pop_user.save()
    pop_photo.save()
