from ..settings import BASE_DIR
from django.http.response import HttpResponse, JsonResponse
import random

def gen_response(code: int, data: str):
    return JsonResponse({
        'code': code,
        'data': data
    }, status=code)

def source(request):
    """
    接受GET请求，获取图片
    @参数：
        id: 图片id
    """
    path = BASE_DIR / 'data' / 'train_a' / (request.GET['id'] + '.jpg')
    f = open(path, "rb")
    return HttpResponse(f.read(), content_type = 'image/jpg')

def upload(request):
    """
    POST form-data格式上传图片
    @参数：
        image: 图片文件
    @返回
        id: 上传图片的id
    """
    image = request.FILES.get('image')
    type = image.name.split('.')[1]
    id = random.randint(0, 1000)
    path = BASE_DIR / 'upload' / (str(id) + '.' + type)
    with open(path, 'wb+') as f:
        for data in image.chunks():
            f.write(data)

    return gen_response(200, {"id": str(id) + '.' + type})