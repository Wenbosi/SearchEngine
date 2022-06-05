import json

with open('a_labels.json') as f:
    label_data = json.loads(f.read())

label_dict = {}

for id, labels in label_data.items():
    for label in labels:
        if label not in label_dict:
            label_dict[label] = 0
        label_dict[label] = label_dict[label] + 1

label_count_list = []

for label,count in label_dict.items():
    label_count_list.append((label,count))

label_count_list = sorted(label_count_list, reverse=True, key=lambda x:x[1])

labels = []

for label_count in label_count_list:
    labels.append(label_count[0])

res = open("sorted_labels.json", "w")
res.write(json.dumps(labels))
res.close()