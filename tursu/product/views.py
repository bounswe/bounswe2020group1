from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from product.models import Product, Category


def category(request):
    """Returns filtered products by category when GET request is made.

    GET parameters:
        name -- name of the categry
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
        category_name = request.GET["name"]
    except:
        return JsonResponse([], safe=False)

    product_data = []
    if category_name == "":
        product_data = Product.objects.all()
    else:
        category_data = Category.objects.filter(Q(name=category_name))
        print(len(category_data))
        if len(category_data) == 1 and category_data[0].name == category_name:
            category_id = category_data[0].id
            product_data = Product.objects.filter(category=category_id)

    products = []
    for product in product_data:
        product_info = {"id": product.pk,
                       "name": product.name,
                       "photo_url": "", 
                       "vendor_name": product.vendor.user.user.first_name,
                       "category": product.category.name,
                       "rating": product.rating,
                       "stock": product.stock,
                       "price": product.price
                    }
                }
        products.append(product_info)

    return JsonResponse(products, safe=False)
