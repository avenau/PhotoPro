#Import required Image library
from PIL import Image, ImageDraw, ImageFont

#Create an Image Object from an Image
img = Image.open('boy.png')
img_width, img_height = img.size

watermark_text = "PhotoPro"

coord_ratios = [0.1, 0.25, 0.75, 0.9]
# Height and width coords for drawing watermark
w = [img_width*r for r in coord_ratios] # left to right
h = [img_height*r for r in coord_ratios] # top to bottom


draw = ImageDraw.Draw(img)
black = (0,0,0)
width = 5
draw.rectangle([w[0], h[0], w[3], h[3]], width=width, outline=black)
draw.rectangle([w[1], h[1], w[2], h[2]], width=width, outline=black)
draw.line([w[0], h[0], w[3], h[3]], width=width, fill=black)
draw.line([w[3], h[0], w[0], h[3]], width=width, fill=black)

font = ImageFont.truetype('arial.ttf', int(1/20 * img_height))
draw.text((w[1], h[0]), watermark_text, font=font, fill=black)

img.show()

# draw = ImageDraw.Draw(img)
# watermark_text = "PhotoPro PhotoPro PhotoPro PhotoPro PhotoPro"


# text_width, text_height = draw.textsize(text, font)

# # calculate the x,y coordinates of the text
# margin = 10
# x = width - textwidth - margin
# y = height - textheight - margin

# # draw watermark in the bottom right corner
# draw.text((0, 0), text+text, font=font)


# #Save watermarked image
# im.save('watermark.png')