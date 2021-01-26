import json
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django import forms
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from product.models import Product, Category
from registered_user.models import Vendor
from actstream.models import action_object_stream, actor_stream, any_stream
from actstream.feeds import AbstractActivityStream
from django.contrib.contenttypes.models import ContentType

#from django.contrib.sites.models import Site
#one = Site.objects.all()[0]
#one.domain = '3.232.20.250'
##one.domain = 'localhost:8000'
#one.name = 'Tursu'
#one.save()
class JSONActivity(AbstractActivityStream):
    def __init__(self):
        super(JSONActivity, self)

    def serialize(self, items):
        return {
            'totalItems': len(items),
            'items': [self.format(action) for action in items]
            }


@api_view(['GET']) 
def vendors(request):
    act = JSONActivity()
    try:
        vendor_name = request.GET["vendor_name"]
        vendor = Vendor.objects.get(user__user__first_name=vendor_name)
    except:
        return HttpResponse("Vendor with name does not exist!", status=400)
    actions = actor_stream(vendor)
    resp = act.serialize(actions)
    return JsonResponse(resp, safe=False)

@api_view(['GET']) 
def products(request):
    act = JSONActivity()
    try:
        product_id = request.GET["product_id"]
        product = Product.objects.get(id=product_id)
    except:
        return HttpResponse("Product with id does not exist!", status=400)
    actions = any_stream(product)
    resp = act.serialize(actions)
    return JsonResponse(resp, safe=False)


