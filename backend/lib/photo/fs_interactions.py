import requests

def save_photo(img_data, filename):
  """
  Send photo to filesystem api for saving
  @param img_data: decoded base 64 image
  @param filename: filename and extension of photo to save
  """
  headers = {"secretkey": "PhotoProSecretAPIKey"}
  data = {"filename": filename, "photo": img_data}
  r = requests.post("http://localhost:8101/save", data=data,headers=headers)