import jwt
from Error import TokenError

secret = "imnotsurewhattomakethis"

# Create a unique JSON Web Token which is a function of the user's u_id and the secret defined above.
def create_token(u_id):
    return jwt.encode({"u_id": u_id}, secret).decode()

def verify_token(token):
    try:
        jwt.decode(token, secret)
    except:
        return False

    return True