# -*- coding: utf-8 -*-
"""
Created on Wed Sep 27 15:07:12 2023

@author: erict
"""

from django.core.management.base import BaseCommand

from dictionary.models import Word
import json

def load_dictionary(filename: str) -> list:
    
    with open(filename, 'r') as file:
    
        dict_json = json.load(file)
        
        dictionary = json.loads(dict_json)
        
    return dictionary
    

class Command(BaseCommand):

    def _insert_words(self):

        dictionary = load_dictionary("dictionary/Merriam Webster.json")

        dictionary = [word for word in dictionary if len(word) == 5]

        for word in dictionary:

            try:
                Word.objects.create(word = word)

            except Exception as e:
                print(e)

    def handle(self, *args, **options):

        self._insert_words()

