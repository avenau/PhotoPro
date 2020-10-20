#!/bin/bash

PORT=8001
HOST='localhost'
ROUTE='/user/profile/uploadphoto'
TOKEN='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1X2lkIjoiNWY4ZTMwZGQ2MTcxOGYzMjY1MjAzMGFhIn0.aYvhcxpOde96D7KjT0q1w7zxuJIXQSWHZbniSgrNTVY'
IMG_URL='https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png'
CONTENT_TYPE=""Content-Type: application/json""
REQUEST_TYPE="POST"

/usr/bin/curl http://$HOST:$PORT$ROUTE -X $REQUEST_TYPE $CONTENT_TYPE -d token=$TOKEN -d img_path=$IMG_URL
