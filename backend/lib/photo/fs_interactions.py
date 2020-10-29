import requests
import os

headers = {"secretkey": "PhotoProSecretAPIKey"}
FS_API_URL = os.getenv("FS_API_URL")


def save_photo(img_data, filename):
  """
  Send photo to filesystem api for saving
  @param img_data: decoded base 64 image
  @param filename: filename and extension of photo to save
  """
  data = {"filename": filename, "photo": img_data}
  r = requests.post(f"{FS_API_URL}/save", data=data, headers=headers)

def find_photo(filename):
  """
  Send photo to filesystem api for saving
  @param filename: filename and extension of photo to find
  """
  params = {"filename": filename}
  r = requests.get(f"{FS_API_URL}/get", params=params, headers=headers)
  return r.content.decode("utf-8")