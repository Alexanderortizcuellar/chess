from PIL import Image
from glob import glob
import os

images = glob("2048/*.png")
os.makedirs("64", exist_ok=True)
for img in images:
    image = Image.open(img)
    img_resized = image.resize((64, 64))
    name = img.split("/")[-1]
    img_resized.save(
            f"64/{name}",
            quality=65,
            optimize=True)
    print(name)
