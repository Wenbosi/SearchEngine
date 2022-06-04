import json
from ..settings import BASE_DIR
from django.http import JsonResponse
import datetime

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

    @返回json：
        count: 结果数量
        time: 搜索用时
        results: 包含所有结果id的list
    """
    start = datetime.datetime.now()

    body = json.loads(request.body)
    key = body['key'].upper() if 'key' in body else ''
    min_width = body['min_width'] if 'min_width' in body else 0
    max_width = body['max_width'] if 'max_width' in body else ''
    min_height = body['min_height'] if 'min_height' in body else 0
    max_height = body['max_height'] if 'max_height' in body else ''
    color = body['color'] if 'color' in body else '0' * 12

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
            res.append(id)

    return JsonResponse({
        "count": len(res),
        "time": datetime.datetime.now() - start,
        "results": res})
