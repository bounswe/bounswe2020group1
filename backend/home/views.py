from django.http import JsonResponse
from rest_framework.decorators import api_view
from product.models import Product, Image
from registered_user.models import get_customer_from_request
from helper.utils import *

def index(request):
    """Returns all products.

    GET parameters:
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
    product_data = Product.objects.all()
    products = []
    static_url = "http://3.232.20.250/static/images/" # TODO Move this to conf
    for product in product_data:
        images = Image.objects.filter(product=product)
        if(len(images) > 0):
            photo_url = f"{static_url}{images[0].photo}"
        else:
            photo_url = ""
        product_info = {"id": product.pk,
                       "name": product.name,
                       "photo_url": photo_url, 	
                       "vendor_name": product.vendor.user.user.first_name,
                       "category": product.category.name,
                       "rating": product.rating,
                       "stock": product.stock,
                       "price": product.price
                    }
        products.append(product_info)

    return JsonResponse(products, safe=False)

@api_view(['GET'])
def bestseller(request):
    """Returns bestseller products in JSON format"""
    product_data = bestseller_products()
    products = product_list_serializer(product_data)
    return JsonResponse(products, safe=False)

@api_view(['GET'])
def newest_arrival(request):
    """Returns newest products in JSON format"""
    product_data = newest_arrival_products()
    products = product_list_serializer(product_data)
    return JsonResponse(products, safe=False)

@api_view(['GET'])
def top_rated(request):
    """Returns top rated products in JSON format"""
    product_data = top_rated_products()
    products = product_list_serializer(product_data)
    return JsonResponse(products, safe=False)

@api_view(['GET'])
def recommended_products(request):
    """Returns personally recommended products in JSON format"""
    customer = get_customer_from_request(request)
    if customer is not None:
        product_data = recommend_based_on_orders(customer)
        recommended = product_list_serializer(product_data)
    else:
        recommended = []
    return JsonResponse(recommended, safe=False)

@api_view(['GET'])
def recommendation_pack(request):
    """Returns all recommendations types in JSON format"""
    customer = get_customer_from_request(request)
    if customer is not None:
        product_data = recommend_based_on_orders(customer)
        recommended = product_list_serializer(product_data)
    else:
        recommended = []

    product_data = bestseller_products()
    bestseller = product_list_serializer(product_data)

    product_data = top_rated_products()
    top_rated = product_list_serializer(product_data)

    product_data = newest_arrival_products()
    newest_arrival = product_list_serializer(product_data)

    recommendation = {
        'recommended': recommended,
        'bestseller': bestseller,
        'top_rated': top_rated,
        'newest_arrival': newest_arrival
    }
    return JsonResponse(recommendation, safe=False)
