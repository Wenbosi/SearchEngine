import json
from PIL import Image, ImageColor
import numpy as np
from sklearn.cluster import KMeans

label_data = {}

with open('a_labels.json') as f:
    label_data = json.loads(f.read())

data = {}

count = 0

def rgb2hsv(color):
    r = color[0]
    g = color[1]
    b = color[2]
    r, g, b = r/255.0, g/255.0, b/255.0
    mx = max(r, g, b)
    mn = min(r, g, b)
    m = mx-mn
    if mx == mn:
        h = 0
    elif mx == r:
        if g >= b:
            h = ((g-b)/m)*60
        else:
            h = ((g-b)/m)*60 + 360
    elif mx == g:
        h = ((b-r)/m)*60 + 120
    elif mx == b:
        h = ((r-g)/m)*60 + 240
    if mx == 0:
        s = 0
    else:
        s = m/mx
    v = mx
    return h,s,v

def sqr(x):
    return x*x

def dis(col_a, col_b):
    return sqr(col_a[0] - col_b[0]) + sqr(col_a[1] - col_b[1]) + sqr(col_a[2] - col_b[2])

color_texts = ['#FF0000', '#FF8000', '#FFFF00', '#00FF00', # red orange yellow green
                '#00FFFF', '#0000FF', '#800080', '#FFC0C0', # light-blue blue purple pink
                '#804020', '#808080', '#FFFFFF', '#000000'] # brown gray white black
colors = [rgb2hsv(ImageColor.getrgb(color_text)) for color_text in color_texts]
#print(colors)

for id, labels in label_data.items():
    img = Image.open('train_a/'+id+'.jpg')
    img = img.convert('RGB')
    #print(img.width, img.height)
    arr = np.array(img.resize((img.width//8, img.height//8)))

    clt = KMeans(n_clusters=5)
    clt.fit(arr.reshape(-1, 3))
    color_fit = [0] * 12
    for c in clt.cluster_centers_:
        color = rgb2hsv(c)
        
        global min_dis, min_dis_col
        min_dis = -1
        min_dis_col = -1
        
        def check(i):
            global min_dis, min_dis_col
            if min_dis == -1 or dis(colors[i], color) < min_dis:
                min_dis = dis(colors[i], color)
                min_dis_col = i
        
        for i in range(7):
            if color[1] > 0.5 and color[2] > 0.5:
                check(i)
        for i in range(7,9):
            if abs(colors[i][0] - color[0]) < 15 and abs(colors[i][1] - color[1]) < 0.4 and abs(colors[i][2] - color[2]) < 0.4:
                check(i)
        for i in range(9,12):
            if color[1] < 0.1 or color[2] < 0.1 or color[2] > 0.9:
                check(i)

        #print(c, color, min_dis_col)
        if min_dis_col != -1:
            color_fit[min_dis_col] = 1

    data[id] = [labels, img.width, img.height] + color_fit

    count = count + 1
    if count % 10 == 0:
        print(count)

res = open("metadata_c.json", "w")
res.write(json.dumps(data))
res.close()