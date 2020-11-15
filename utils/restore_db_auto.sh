#!/bin/bash

# Run this to restore the remote database to a previous save

curl -q "https://photopro.fsapi.coen-townson.me/restore" -H "secretkey: PhotoProSecretAPIKey"