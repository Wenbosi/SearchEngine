import json
from ..settings import BASE_DIR
from django.http import JsonResponse

def search(request):
    """
    接受POST请求，搜索图片
    @参数：
        key: 文字信息
        min_width: 最小宽度
        max_width: 最大宽度
        min_height: 最小高度
        max_height: 最大高度

    @返回：
        包含所有结果id的list
    """
    body = json.loads(request.body)
    key = body['key'].upper() if 'key' in body else ''
    min_width = body['min_width'] if 'min_width' in body else 0
    max_width = body['max_width'] if 'max_width' in body else ''
    min_height = body['min_height'] if 'min_height' in body else 0
    max_height = body['max_height'] if 'max_height' in body else ''

    res = []

    data = {}
    with open(BASE_DIR / 'data' / 'metadata.json') as f:
        data = json.loads(f.read())
    
    for id, data in data.items():
        found_key = False
        for label in data[0]:
            if key in label.upper():
                found_key = True

        size_ok = data[1] >= min_width and data[2] >= min_height
        if max_width != '' and data[1] > max_width:
            size_ok = False
        if max_height != '' and data[2] > max_height:
            size_ok = False

        if found_key and size_ok:
            res.append(id)

    return JsonResponse({"results": res})
