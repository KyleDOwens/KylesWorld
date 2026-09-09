# This script is used to change the quality level of all jpegs in a folder

from PIL import Image
import os


def compressDir(target, quality):
    if (os.getcwd().split("/")[-1] != "kyles_world"):
        exit("ERROR: This script must be run from the project directory, not the script directory or anywhere else")

    # Compress file
    if os.path.isfile(target) and target.lower().endswith(('.jpg', '.jpeg')):
        with Image.open(target) as img:
            img.save(target, "JPEG", quality=quality, optimize=True)
            print(f"Compressed {target} to quality {quality}")

    # Compress dir
    elif os.path.isdir(target):
        for filename in os.listdir(target):
            if not filename.lower().endswith(('.jpg', '.jpeg')):
                continue

            input_path = os.path.join(target, filename)
            output_path = os.path.join(target, filename)

            with Image.open(input_path) as img:
                img.save(output_path, "JPEG", quality=quality, optimize=True)
                print(f"Compressed {target}/{filename} to quality {quality}")
    
    else:
        print(f"ERROR: {target} not identified as file or dir")



# Keep track of quality used for each dir
dirs = [
    # ("images/music/2024", 13),
    # ("images/music/2025", 13),
    # ("images/music/2026", 13),
    # ("images/photobook/japan", 8),
    # ("images/photobook/china", 8),
    # ("images/photobook/camino", 8),
    # ("images/recipes", 8),
]

for d, q in dirs:
    compressDir(d, q)