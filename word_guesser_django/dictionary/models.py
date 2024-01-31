from django.db import models

class Word(models.Model):

    id = models.AutoField(primary_key = True)
    word = models.CharField(max_length = 15, unique = True, editable = False)

    def __str__(self):
        return self.word
