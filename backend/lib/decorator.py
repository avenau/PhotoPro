# from functools import wraps

def require_key(func):
    def inner():
        return func()
    return inner
