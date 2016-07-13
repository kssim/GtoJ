from django.template.loader import get_template
from django.http import HttpResponse
from django.template import Context
from django.template.context_processors import csrf
from rest_framework import mixins
from rest_framework.generics import GenericAPIView
from controller.models import DataInfo
from controller.serializer import DataItemSerializer


class DataListApi(GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = DataInfo.objects.all()
    serializer_class = DataItemSerializer

    def get(self, request, *args, **kargs):
        return self.list(request, *args, **kargs)

    def post(self, request, *args, **kargs):
        return self.create(request, *args, **kargs)


class DataItemApi(GenericAPIView, mixins.RetrieveModelMixin, mixins.DestroyModelMixin, mixins.UpdateModelMixin):
    queryset = DataInfo.objects.all()
    serializer_class = DataItemSerializer

    def get(self, request, *args, **kargs):
        return self.retrieve(request, *args, **kargs)

    def delete(self, request, *args, **kargs):
        return self.destroy(request, *args, **kargs)


def main_view(request):
    template = get_template("main.html")

    data_list = DataInfo.objects.all()

    context = Context({'data_list': data_list})
    context.update(csrf(request))

    return HttpResponse(template.render(context))