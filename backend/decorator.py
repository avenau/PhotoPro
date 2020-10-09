from functools import wraps

def require_key(func):
    def inner():
        print("I got decorated")
        return func()
    return inner
