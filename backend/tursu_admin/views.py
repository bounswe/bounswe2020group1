"""Views related to admin"""
import os
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django import forms
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from product.models import Product, Image
from registered_user.models import get_admin_from_request
from search.views import SearchHelper

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['DELETE','POST'])
def delete_product(request):
    """Delete product with given parameters when DELETE request is made."""
    admin = get_admin_from_request(request)
    if(admin is None):
        return HttpResponse("Admin authentication failed", status=401)
    try:
        product_id = request.POST["id"]
    except KeyError:
        return HttpResponse("Product id not specified", status=400)
    try:
        product = Product.objects.get(id=product_id)
    except Exception:
        return HttpResponse("There is no such product with the id", status=400)
    images = Image.objects.filter(product=product)
    if len(images) > 0:
        files = [os.path.join("static/images",str(image.photo)) for image in images]
        for f in files:
            os.remove(f)
    product.delete()
    return HttpResponse("success")

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_products_waiting_verification(request):
    """Gets all products waiting verification."""
    admin = get_admin_from_request(request)
    if(admin is None):
        return HttpResponse("Admin authentication failed", status=401)
    products = Product.objects.filter(is_verified=False)
    return JsonResponse(SearchHelper.prepare_products(products), safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def verify_product(request):
    """Verifies product with given parameters when POST request is made."""
    admin = get_admin_from_request(request)
    if(admin is None):
        return HttpResponse("Admin authentication failed", status=401)
    try:
        product_id = request.POST["id"]
    except KeyError:
        return HttpResponse("Product id not specified", status=400)
    try:
        product = Product.objects.get(id=product_id)
    except Exception:
        return HttpResponse("There is no such product with the id", status=400)
    product.is_verified = True
    product.save()
    return HttpResponse("Successfully verified product")