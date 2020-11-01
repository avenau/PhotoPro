#Import required Image library
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import base64

def create_watermarked_image(base64_str, name, extension):
    '''
    Given the base64, name (equal to ObjectId), and extension of a photo, 
    put a watermark over it and save it with to the file system with "_w" suffix.

    Photos must be watermarked after being converted to thumbnail,
    not the other way around. This is so that watermarked thumbnails have suffix
    "_t_w" in that order. E.g. "abc123_t_w.png" as opposed to "abc123_w_t.png".

    Currently only works for PNGs and JP(E)Gs
    '''
    img_data = base64.b64decode(base64_str)
    watermarked_filename = name + "_w" + extension

    #Create an Image Object from an Image
    img = Image.open(BytesIO(img_data))
    img_width, img_height = img.size

    coord_ratios = [0.1, 0.25, 0.75, 0.9]
    # Height and width coords for drawing watermark
    w = [img_width*r for r in coord_ratios] # left to right
    h = [img_height*r for r in coord_ratios] # top to bottom


    draw = ImageDraw.Draw(img)
    # Draw some rectangles and lines
    black = (0,0,0)
    thickness = max([1, int(img_height/100)])
    draw.rectangle([w[0], h[0], w[3], h[3]], width=thickness, outline=black)
    draw.rectangle([w[1], h[1], w[2], h[2]], width=thickness, outline=black)
    draw.line([w[0], h[0], w[3], h[3]], width=thickness, fill=black)
    draw.line([w[3], h[0], w[0], h[3]], width=thickness, fill=black)

    # Write "PhotoPro (c)" in red
    red = (255, 0, 0)
    font_size = max([1, int(img_height/20)])
    watermark_text = "PhotoPro (c)"
    # Following line may not work on all OSes. May need to specify absolute path to font.
    font = ImageFont.truetype('arial.ttf', font_size)
    draw.text((w[1], h[0]), watermark_text, font=font, fill=red)

    img.show()

    img.save(watermarked_filename)