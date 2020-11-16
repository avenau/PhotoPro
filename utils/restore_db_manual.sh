#!/bin/bash

# ONLY RUN IF YOU KNOW WHAT YOU ARE DOING
# Run this to reset the database to the save located in $dir

dir="/var/backups/mongobackups/photopro/angular-flask-muckaround/"

if [ -e $dir ]
then
  mongorestore --host="jaczel.com" --port="27017" -u "jajac" -p "databasepassword"  --nsInclude="angular-flask-muckaround.*" --dir="$dir" --authenticationDatabase "admin" --drop -d "angular-flask-muckaround"
  echo "Database has been restored to a previous save point"
else
  echo "Could not find DB backup. No restore was performed."
  exit 1
fi
