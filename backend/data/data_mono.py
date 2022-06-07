import json
from PIL import Image, ImageColor
import numpy as np
from sklearn.cluster import KMeans

label_data = {}

with open('a_labels.json') as f:
    label_data = json.loads(f.read())

data = {}

count = 0

for id, labels in label_data.items():
    img = Image.open('train_a/'+id+'.jpg')

    data[id] = '1' if img.mode == 'L' else '0'

    count = count + 1
    if count % 10 == 0:
        print(count)

res = open("metadata_m.json", "w")
res.write(json.dumps(data))
res.close()