import json
from ..settings import BASE_DIR
from django.http import JsonResponse
import datetime

def correct(key):
    """
    若无法找到key对应的label，猜测输入错误，返回可能正确的输入（否则为''）
    """
    labels = []
    with open(BASE_DIR / 'data' / 'sorted_labels.json') as f:
        labels = json.loads(f.read())
    
    for label in labels:
        if key in label.upper():
            return ''
    
    for label in labels:
        for i in range(len(key)):
            for c in range(26):
                if key[:i] + chr(ord('A')+c) + key[i+1:] in label.upper():
                    return label
        for i in range(len(key)-1):
            if key[:i] + key[i+1] + key[i] + key[i+2:] in label.upper():
                return label

    return ''

def predict(request):
    """
    接受GET请求，通过用户部分输入推测查询词
    @参数：
        input: 用户输入
    
    @返回：
        predictions: 预测词list
    """
    input = str(request.GET['input']).upper()

    labels = []
    with open(BASE_DIR / 'data' / 'sorted_labels.json') as f:
        labels = json.loads(f.read())

    predictions = []
    for label in labels:
        if label.upper().startswith(input):
            predictions.append(label)
            if len(predictions) > 10:
                break
    
    return JsonResponse({
        "predictions": predictions,
    })

def search(request):
    """
    接受POST请求，搜索图片
    @参数：
        key: 文字信息
        min_width: 最小宽度
        max_width: 最大宽度，''代表无限制
        min_height: 最小高度
        max_height: 最大高度，''代表无限制
        color: 赤橙黄绿青蓝紫粉棕灰白黑 12位01串 1表示筛选对应颜色
        page: 页码，每页36个

    @返回：
        count: 结果数量
        time: 搜索用时
        correction: 输入错误时为推测的输入，否则为''
        results: 包含所有结果的list，每个包括：
            id: 图片id
            labels: 图片描述的list
    """
    start = datetime.datetime.now()

    body = json.loads(request.body)
    key = body['key'].upper() if 'key' in body else ''
    min_width = body['min_width'] if 'min_width' in body else 0
    max_width = body['max_width'] if 'max_width' in body else ''
    min_height = body['min_height'] if 'min_height' in body else 0
    max_height = body['max_height'] if 'max_height' in body else ''
    color = body['color'] if 'color' in body else '0' * 12
    page = body['page'] if 'page' in body else ''

    correction = correct(key)
    if correction != '':
        key = correction.upper()

    res = []

    datas = {}
    with open(BASE_DIR / 'data' / 'metadata_c.json') as f:
        datas = json.loads(f.read())
    
    for id, data in datas.items():
        found_key = False
        for label in data[0]:
            if key in label.upper():
                found_key = True

        size_ok = data[1] >= min_width and data[2] >= min_height
        if max_width != '' and data[1] > max_width:
            size_ok = False
        if max_height != '' and data[2] > max_height:
            size_ok = False

        color_ok = True
        for i in range(12):
            if color[i] == '1' and data[3+i] == 0:
                color_ok = False

        if found_key and size_ok and color_ok:
            res.append({"id": id, "labels": data[0]})

    return JsonResponse({
        "count": len(res),
        "time": (datetime.datetime.now() - start).total_seconds(),
        "correction": correction,
        "results": res if page == '' else res[36*page: 36*(page+1)]})
