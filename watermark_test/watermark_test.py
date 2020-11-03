from PIL import Image, ImageDraw, ImageFont, ImageSequence

img = Image.open("g.gif")
img_width, img_height = img.size

# Height and width coords for drawing watermark
coord_ratios = [0.1, 0.25, 0.75, 0.9]
w = [img_width*r for r in coord_ratios] # left to right
h = [img_height*r for r in coord_ratios] # top to bottom
black = (0,0,0)
red = (255, 0, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
thickness = max([1, int(img_height/100)])
frames = [frame.copy() for frame in ImageSequence.Iterator(img)]
for frame in frames:
    draw = ImageDraw.Draw(frame)
    # Draw some rectangles and lines
    draw.rectangle([w[0], h[0], w[3], h[3]], width=thickness, outline=black)
    draw.rectangle([w[1], h[1], w[2], h[2]], width=thickness, outline=green)
    draw.line([w[0], h[0], w[3], h[3]], width=thickness, fill=red)
    draw.line([w[3], h[0], w[0], h[3]], width=thickness, fill=blue)
    # Write "PhotoPro (c)" in red
    watermark_text = "PhotoPro (c)"
    # Following line only works on windows. May need to specify absolute path to font.
    # font_size = max([1, int(img_height/20)])
    # font = ImageFont.truetype('arial.ttf', size=font_size)
    draw.text((w[1], h[0]), watermark_text, fill=red)

out = frames[0]
out.info = img.info
out.save("w.gif", format=img.format, save_all=True, append_images=frames[1:], loop=0)