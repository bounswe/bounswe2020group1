#from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
#from django.contrib.auth.models import User
#from django.core import serializers
from django.db.models import Q
from product.models import Product

def index(request):
    """Returns searched products when GET request is made.

    GET parameters:
        search_string -- the search string to be used for querying
        search_type -- "vendor" if searching for vendors, "product" if searching for products
    Response format: JSON
    Response: List[dict]: List of product dictionaries with product information including
        - id
        - name
        - photo_url
        - vendor_name
        - category
        - rating
        - stock
        - price
    """
    try:
        search_string = request.GET["search_string"]
    except :
        return JsonResponse([], safe=False)
    try:
        search_type = request.GET["search_type"]
    except :
        return HttpResponse('Select search_type as vendor or product to search',status=400)

    if search_type == "product":
        query = Q()
        for word in search_string.split():
            query |= Q(name__icontains=word) | \
                    Q(description__icontains=word) | \
                    Q(category__name__icontains=word) | \
                    Q(vendor__user__user__first_name__icontains=word)
        data = Product.objects.filter(query)
    elif search_type == "vendor":
        raise NotImplementedError("Vendor search is not yet implemented")
    else:
        return HttpResponse('Select search_type as vendor or product to search',status=400)

    products = []
    for product in data:
        product_info ={"id": product.pk,
                       "name": product.name,
                       "photo_url": "", 	#TODO ADD PHOTO URL
                       "vendor_name": product.vendor.user.user.first_name,
                       "category": product.category.name,
                       "rating": product.rating,
                       "stock": product.stock,
                       "price": product.price
                    }
        products.append(product_info)
    return JsonResponse(products, safe=False)
