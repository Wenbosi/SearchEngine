import json
from PIL import Image
import numpy as np

label_data = {}

with open('a_labels.json') as f:
    label_data = json.loads(f.read())

data = {}

count = 0

def dhash(image):
    image = np.array(image.resize((9,8)).convert('L'))
    hash = ''
    for i in range(8):
        for j in range(8):
            if image[i,j] > image[i,j+1]:
                hash += '1'
            else:
                hash += '0'
    return hash


for id, labels in label_data.items():
    img = Image.open('train_a/'+id+'.jpg')
    data[id] = [dhash(img)]

    count = count + 1
    if count % 10 == 0:
        print(count)

res = open("dhash.json", "w")
res.write(json.dumps(data))
res.close()