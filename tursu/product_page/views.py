from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from product.models import Product

def index(request):
    try:
        product_id = request.GET["id"]
    except:
        return JsonResponse([], safe=False)
        
    product = Product.objects.filter(Q(id=product_id))
    product = product[0]
    
    print(product_id)
    product_info = {"id": product.pk,
                "name": product.name,
                "description": product.description,
                "photo_url": "",    #TODO ADD PHOTO URL
                "vendor_name": product.vendor.user.user.first_name,
                "category": product.category.name,
                "rating": product.rating,
                "stock": product.stock,
                "price": product.price,
                "comments": ""      #WILL BE EMPTY FOR THE FIRST MILESTONE
            }
                   
    return JsonResponse(product_info, safe=False)
    