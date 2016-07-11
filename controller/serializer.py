from rest_framework import serializers
from controller.models import DataInfo

class DataItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataInfo
