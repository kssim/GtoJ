from django.template.loader import get_template
from django.http import HttpResponse
from django.template import Context
from django.template.context_processors import csrf
from rest_framework import mixins
from rest_framework.generics import GenericAPIView
from controller.models import TcInfo
from controller.serializer import TcInfoSerializer


class TcListApi(GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = TcInfo.objects.all()
    serializer_class = TcInfoSerializer

    def get(self, request, *args, **kargs):
        return self.list(request, *args, **kargs)

    def post(self, request, *args, **kargs):
        return self.create(request, *args, **kargs)


class TcItemApi(GenericAPIView, mixins.RetrieveModelMixin, mixins.DestroyModelMixin, mixins.UpdateModelMixin):
    queryset = TcInfo.objects.all()
    serializer_class = TcInfoSerializer

    def get(self, request, *args, **kargs):
        return self.retrieve(request, *args, **kargs)

    def delete(self, request, *args, **kargs):
        return self.destroy(request, *args, **kargs)


def main_view(request):
    template = get_template("main.html")

    context = Context({})
    context.update(csrf(request))

    return HttpResponse(template.render(context))