#!/bin/bash

cd backend
if ! [ -e images ]
then
  mkdir images
fi
cd images

echo "Downloading images.zip"
wget -q -O "images.zip" "https://photopro.fsapi.coen-townson.me/download" --header="secretkey: PhotoProSecretAPIKey" file.zip
unzip -qo images.zip
rm images.zip

echo "Download of images/ complete :)"
