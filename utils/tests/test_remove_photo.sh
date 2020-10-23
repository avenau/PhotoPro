#!/bin/bash

PORT=8001
HOST='localhost'
ROUTE='/user/photos/removephoto'
TOKEN='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1X2lkIjoiNWY4Zjg5MTc4YTZhM2Y4ZWYyMDNmNjY5In0.jCv_4XQvrqk6GBrBX9vqcbzFM3LKgKN7clxcYOtPVOw'
IMG_ID='5f92350ff659e958410aa07c'

CONTENT_TYPE=""Content-Type: application/json""
REQUEST_TYPE="DELETE"

/usr/bin/curl http://$HOST:$PORT$ROUTE?token=$TOKEN\&imgId=$IMG_ID -X $REQUEST_TYPE $CONTENT_TYPE
