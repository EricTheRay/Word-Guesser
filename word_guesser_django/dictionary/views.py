from django.shortcuts import render
from django.http import HttpRequest, HttpResponse, JsonResponse, HttpResponseBadRequest
from rest_framework.decorators import api_view

from .models import Word

import datetime
import hashlib

answer_obj = { }

@api_view(['PUT'])
def submit_word(request: HttpRequest) -> HttpResponse:
    
    global answer_obj

    try:

        answer = answer_obj[datetime.date.today().strftime("%Y%m%d")]

    except:
        
        dictionary = Word.objects.all()
        n_words = len(dictionary)

        date = datetime.date.today().strftime("%Y%m%d")

        h = hashlib.blake2b(b'', digest_size = 4)
        h.update(date.encode('utf-8'))

        answer = dictionary[int(h.hexdigest(), 16) % n_words].word

        answer_obj = { date: answer }

    word = request.data['word'].lower()

    if len(word) != 5:
        return HttpResponseBadRequest("Only accepts five-letter word.")

    try:
        word_obj = Word.objects.get(word = word)

    except:
        return JsonResponse({
            'status': 'submitted', 
            'data': {
                'description': "word not found"
            }
        })
    
    res = []
    des = ""

    if word == answer:

        des = "correct answer"
        res = ['correct', 'correct', 'correct', 'correct', 'correct']

    else:

        des = "word checked"

        for i in range(0, 5):

            if word[i] == answer[i]:
                res.append('correct')

            else:
                res.append('absent')

        for i in range(0, 5):

            if res[i] == 'absent' and word[i] in answer and count_revealed(word, res, word[i]) < count_presence(answer, word[i]):
                res[i] = 'present'

    return JsonResponse({
        'status': 'submitted',
        'data': {
            'description': des, 
            'result': res
        }
    })


def count_presence(word: str, letter: str) -> int:

    res = 0

    for c in word:

        if c == letter:
            res += 1

    return res


def count_revealed(word: str, revealed: list[str], letter: str) -> int:

    idx = len(revealed)

    if idx == 0:
        return 0

    res = 0

    for i in range(0, idx):

        if word[i] == letter and (revealed[i] == 'correct' or revealed[i] == 'present'):
            res += 1

    return res


@api_view(['GET'])
def request_answer(request):

    global answer_obj

    try:

        answer = answer_obj[datetime.date.today().strftime("%Y%m%d")]

    except:

        dictionary = Word.objects.all()
        n_words = len(dictionary)

        date = datetime.date.today().strftime("%Y%m%d")

        h = hashlib.blake2b(b'', digest_size = 4)
        h.update(date.encode('utf-8'))

        answer = Word.objects.get(id = int(h.hexdigest(), 16) % n_words).word

        answer_obj = { date: answer }

    return JsonResponse({
        'status': 'answer revealed', 
        'data': {
            'result': answer
        }
    })
