# -*- coding: utf-8 -*-
"""
Created on Wed Sep 27 15:07:12 2023

@author: erict
"""

from django.core.management.base import BaseCommand

from dictionary.models import Word
import json

class Command(BaseCommand):

    def _delete_words(self):

        words = Word.objects.all()

        try:
            words.delete()

        except Exception as e:
            print(e)

    def handle(self, *args, **options):

        self._delete_words()

