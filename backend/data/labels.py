import csv
import json
import os

label_dict = {}

with open("class-descriptions-boxable.csv") as f:
    reader = csv.reader(f)
    for row in reader:
        label_dict[row[0]] = row[1]

labels = {}


with open("train-annotations-human-imagelabels-boxable.csv") as f:
    reader = csv.reader(f)
    for row in reader:
        if row[3] == '1' and row[0][0] == 'a' and os.path.exists('train_a/'+row[0]+'.jpg'):
            if row[0] not in labels:
                labels[row[0]] = []
            labels[row[0]].append(label_dict[row[2]])
            
res = open("a_labels.json", "w")
res.write(json.dumps(labels))
res.close()
