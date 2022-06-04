from ..settings import BASE_DIR
from django.http.response import HttpResponse

def source(request):
    """
    接受GET请求，获取图片
    @参数：
        id: 图片id
    """
    path = BASE_DIR / 'data' / 'train_a' / (request.GET['id'] + '.jpg')
    f = open(path, "rb")
    return HttpResponse(f.read(), content_type = 'image/jpg')
