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

from django.contrib.sites.models import Site
one = Site.objects.all()[0]
#one.domain = 'http//3.232.20.250'
one.domain = 'localhost:8000'
one.name = 'Tursu'
one.save()
class JSONActivity(AbstractActivityStream):
    def __init__(self):
        super(JSONActivity, self)

    def serialize(self, items):
        return {
            'totalItems': len(items),
            'items': [self.format(action) for action in items]
            }
# Add related functions to form JSON to change the stream 
# https://django-activity-stream.readthedocs.io/en/latest/_modules/actstream/feeds.html#AbstractActivityStream
#    def format_item(self, action, item_type='actor'):
#        """
#        Returns a formatted dictionary for an individual item based on the action and item_type.
#        """
#        obj = getattr(action, item_type)
#        return {
#            'id': self.get_uri(action, obj),
#            'url': self.get_url(action, obj),
#            'objectType': ContentType.objects.get_for_model(obj).name,
#            'displayName': str(obj)
#        }



@api_view(['GET']) 
def vendors(request):
    act = JSONActivity()
    # TODO UPDATE TO RETURN ALL VENDORS
    actions = actor_stream(Vendor.objects.get(id=30))
    resp = act.serialize(actions)
    return JsonResponse(resp, safe=False)

@api_view(['GET']) 
def products(request):
    act = JSONActivity()
    # TODO UPDATE TO RETURN ALL PRODUCTS
    actions = any_stream(Product.objects.get(id=49))
    resp = act.serialize(actions)
    return JsonResponse(resp, safe=False)


