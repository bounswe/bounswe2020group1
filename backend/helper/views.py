from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django import forms
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from product.models import Product, Category
from registered_user.models import Vendor

@api_view(['GET']) 
def allcategories(request):
    categories = []
    allCategories = Category.objects.all()

    for item in allCategories:
        categories.append(item.name)

    return JsonResponse(categories, safe=False)

@api_view(['GET']) 
def allvendors(request):
    vendors = []
    allVendors = Vendor.objects.all()

    for item in allVendors:
        vendors.append(item.user.user.username)

    return JsonResponse(vendors, safe=False)

@api_view(['GET']) 
def allbrands(request):
    brands = []
    allBrands = Product.objects.values('brand').distinct()
    for brand in allBrands:
        brands.append(brand["brand"])
    return JsonResponse(brands, safe=False)