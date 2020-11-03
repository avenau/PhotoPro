from PIL import Image, ImageSequence

img = Image.open("homer.gif")
frames = [frame.copy() for frame in ImageSequence.Iterator(img)]
out = frames[0]
out.info = img.info
out.save("homer_same.gif", format=img.format, save_all=True, append_images=frames[1:], loop=0, optimize=True)