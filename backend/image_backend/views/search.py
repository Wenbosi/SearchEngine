import json
import re

from ..settings import BASE_DIR
from django.http import JsonResponse
import datetime
from PIL import Image
import numpy as np
import time
import json
import requests
import hashlib
import uuid
from spellchecker import SpellChecker
import difflib

from gensim.models import KeyedVectors
vectors = KeyedVectors.load('data/vectors.bin')


def isChinese(word):
    for ch in word:
        if '\u4e00' <= ch <= '\u9fff':
            return True
    return False


def translate(word):
    youdao_url = 'https://openapi.youdao.com/api'
    translate_text = word
    time_curtime = int(time.time())
    app_id = "02e7f6953a229282"
    uu_id = uuid.uuid4()
    app_key = "p20UHwhDClpIaHItd9rqlmvFtp05w8Je"
    sign = hashlib.sha256((app_id + translate_text + str(uu_id) + str(time_curtime) + app_key).encode('utf-8')).hexdigest()
    data = {
        'q' : translate_text,
        'from' : "zh-CHS",
        'to' : "en",
        'appKey' : app_id,
        'salt' : uu_id,
        'sign' : sign,
        'signType' : "v3",
        'curtime' : time_curtime,
    }

    r = requests.get(youdao_url, params = data).json()
    return r["translation"][0]


def gen_response(code: int, data: str):
    return JsonResponse({
        'code': code,
        'data': data
    }, status=code)


def max_sim(word, labels):
    maxv = -1
    label = ""
    for item in labels:
        s = difflib.SequenceMatcher(None, word, item.upper()).quick_ratio()
        print(word, item.upper(), s)
        if s > maxv:
            maxv = s
            label = item
    print(word, label, maxv)
    return label


def correct(key, labels):
    """
    拼写纠错
    """
    spell = SpellChecker()
    found = False
    res = ''
    for word in key.split(' '):
        correction = spell.correction(word)
        if word != correction:
            found = True
            correction = max_sim(word, labels)
        res = correction if res == '' else res + ' ' + correction
    if found:
        return res
    return ''


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


def dis(d1, d2):
    res = 0
    for i in range(len(d1)):
        if d1[i] != d2[i]:
            res = res + 1
    return res


def score(key, label):
    key_words = key.split(' ')
    label_words = label.split(' ')
    max_score = 0
    for start in range(len(key_words)):
        score = 0
        for i in range(min(len(key_words) - start, len(label_words))):
            s = difflib.SequenceMatcher(None, key_words[start+i], label_words[i]).quick_ratio()
            if s > 0.75:
                score = score + s
        if score > max_score:
            max_score = score
    max_score = max_score / len(label_words)
    return max_score


def predict(request):
    """
    接受GET请求，通过用户部分输入推测查询词
    @参数：
        input: 用户输入
    
    @返回：
        predictions: 预测词list
    """
    body = json.loads(request.body)
    print(body)
    input = body['input'].upper()

    labels = []
    with open(BASE_DIR / 'data' / 'sorted_labels.json') as f:
        labels = json.loads(f.read())

    predictions = []
    for label in labels:
        if label.upper().startswith(input):
            predictions.append(label)
            if len(predictions) > 6:
                break
    if input == "":
        predictions = []
    data = { "predictions": predictions }
    return gen_response(200, data)


def search(request):
    """
    接受POST请求，搜索图片
    @参数：
        key: 文字信息
        image: 使用以图搜图则输入upload接口上传获得的图片id，否则为空
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
    print(body)
    key = body['key'] if 'key' in body else ''
    image = body['image'] if 'image' in body else ''
    min_width = body['min_width'] if 'min_width' in body else 0
    max_width = body['max_width'] if 'max_width' in body else ''
    min_height = body['min_height'] if 'min_height' in body else 0
    max_height = body['max_height'] if 'max_height' in body else ''
    color = body['color']
    size = body['size']
    page = body['page'] if 'page' in body else ''

    res = []

    datas = {}
    with open(BASE_DIR / 'data' / 'metadata_c.json') as f:
        datas = json.loads(f.read())

    if image != '':
        image = dhash(Image.open(BASE_DIR / 'upload' / image))

    dhash_data = {}
    with open(BASE_DIR / 'data' / 'dhash.json') as f:
        dhash_data = json.loads(f.read())

    mono_data = {}
    with open(BASE_DIR / 'data' / 'metadata_m.json') as f:
        mono_data = json.loads(f.read())

    labels = []
    with open(BASE_DIR / 'data' / 'sorted_labels.json') as f:
        labels = json.loads(f.read())

    
    key = key.replace("%20", " ")
    if key != '' and isChinese(key[0]):
        key = translate(key)
        key = key.upper()
        correction = ''
    else:
        key = key.upper()
        correction = correct(key, labels)
        # if correction != '':
        #    key = correction
    

    labels_score = {}
    for label in labels:
        labels_score[label] = score(key, label.upper())
    

    for id, data in datas.items():
        best_label = ""
        found_key = False
        key_score = 0
        max_score = 0
        for label in data[0]:
            s = labels_score[label]
            if s > max_score:
                max_score = s
                best_label = label
                found_key = True
            key_score = key_score + s
        
        if size == 0: # 全部
            size_ok = True
        elif size == 1: # 小
            if data[1] * data[2] < 720 * 720:
                size_ok = True
            else:
                size_ok = False
        elif size == 2: # 中
            if data[1] * data[2] >= 720 * 720 and data[1] * data[2] < 1080 * 720:
                size_ok = True
            else:
                size_ok = False
        elif size == 3: # 大
            if data[1] * data[2] >= 1080 * 720:
                size_ok = True
            else:
                size_ok = False
        elif size == 5: # 自定义
            size_ok = (data[1] >= min_width and data[2] >= min_height)
            if max_width != '' and data[1] > max_width:
                size_ok = False
            if max_height != '' and data[2] > max_height:
                size_ok = False
        

        color_ok = True
        if color == 0 : # 全部
            color_ok = True
        elif color == 1 : # 彩色
            if mono_data[id] == '1':
                color_ok = False
        elif color == 2 : # 黑白
            if mono_data[id] == '0':
                color_ok = False
        elif color == 3 : # 红
            if data[3] == 0:
                color_ok = False
        elif color == 4 : # 橙
            if data[4] == 0:
                color_ok = False
        elif color == 5 : # 黄
            if data[5] == 0:
                color_ok = False
        elif color == 6 : # 绿
            if data[6] == 0:
                color_ok = False
        elif color == 7 : # 青
            if data[7] == 0:
                color_ok = False
        elif color == 8 : # 蓝
            if data[8] == 0:
                color_ok = False
        elif color == 9 : # 紫
            if data[9] == 0:
                color_ok = False
        elif color == 10 : # 粉
            if data[10] == 0:
                color_ok = False
        elif color == 11 : # 棕
            if data[11] == 0:
                color_ok = False
        elif color == 12 : # 灰
            if data[12] == 0:
                color_ok = False
        

        image_ok = True
        value = 0
        if image != '':
            value = dis(dhash_data[id][0], image)
            if value > 10:
                image_ok = False

        if found_key and size_ok and color_ok and image_ok:
            res.append({"id": id, "label": best_label, "width": data[1], "height": data[2], "value": value, "score": key_score})
    
    if image != '':
        res = sorted(res, key=lambda x:x["value"])

    if key != '':
        res = sorted(res, key=lambda x:x["score"], reverse=True)
    
    # if len(res) > 1000:
    #    res = res[:1000]

    if len(res) < page * 36:
        results = res[36 * (page - 1) : ]
    else:
        results = res[36 * (page - 1) : 36 * page]

    data = {
        "count": len(res),
        "pages": (len(res) - 1) // 36 + 1,
        "time": (datetime.datetime.now() - start).total_seconds(),
        "correction": correction,
        "results": results
    }
    
    return gen_response(200, data)
