from rest_framework import serializers
from controller.models import TcInfo

class TcInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TcInfo
