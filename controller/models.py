from django.db import models

class TcInfo(models.Model):
    index = models.AutoField(primary_key=True, unique=True)
    name = models.CharField(max_length=256)
    data_list = models.CharField(max_length=2048)
