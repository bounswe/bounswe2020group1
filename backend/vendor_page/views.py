from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django.conf import settings
from django import forms
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from product.models import Product, Image
from order.models import Order
from registered_user.models import Vendor, get_vendor_from_request
from comment.models import Comment
from search.views import SearchHelper

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET']) 
def index(request):
    vendor = get_vendor_from_request(request)
    if(vendor is None):
        return HttpResponse("Vendor authentication failed", status=401)
    
    orders = Order.objects.filter(Q(vendor=vendor))
    my_orders = []
    for order in orders:
        comment = Comment.objects.filter(Q(order=order))
        if len(comment) == 0:
            comment = ""
        else:
            comment = comment[0].text
        order_info = {
                "id": order.id,
                "customer": order.customer.user.user.username,
                "product": order.product.pk,
                "status": order.status,
                "cargoID": order.cargoID,
                "orderDate": order.orderDate,
                "estimatedArrivalDate": order.estimatedArrivalDate ,
                "arrivalDate": order.arrivalDate,
                "quantity": order.quantity,
                "comment": comment
            }
        my_orders.append(order_info)
        
    products = Product.objects.filter(Q(vendor=vendor))
    my_products = []
    for product in products:
        static_url = settings.TURSU_STATIC_URL
        images = Image.objects.filter(product=product)
        if(len(images) > 0):
            photo_url = f"{static_url}{images[0].photo}"
        else:
            photo_url = ""
  
        product_info = {"id": product.pk,
                "category": product.category.name,
                "name": product.name,
                "brand": product.brand,
                "description": product.description,
                "rating": product.rating,
                "stock": product.stock,
                "price": product.price,
                "date_added": product.date_added,
                "photo_url": photo_url
            }
        my_products.append(product_info)
        
    vendor_info = {"username": vendor.user.user.username,
                "email": vendor.user.user.email,
                "first_name": vendor.user.user.first_name,
                "last_name": vendor.user.user.last_name,
                "latitude": str(vendor.location.latitude),
                "longitude": str(vendor.location.longitude),
                "iban": vendor.iban,
                "rating": vendor.rating,
                "orders": my_orders,
                "products": my_products
            }
            
    return JsonResponse(vendor_info, safe=False)

@api_view(['GET']) 
def public_vendor_page(request):
    try:
        vendor_name = request.GET["vendor_name"]
        vendor = Vendor.objects.get(user__user__first_name=vendor_name)
    except:
        return HttpResponse("Vendor with name does not exist!", status=400)
    product_info = Product.objects.filter(vendor=vendor)
    products =  SearchHelper.prepare_products(product_info)
    vendor_info = {
                "username": vendor.user.user.username,
                "email": vendor.user.user.email,
                "first_name": vendor.user.user.first_name,
                "last_name": vendor.user.user.last_name,
                "latitude": str(vendor.location.latitude),
                "longitude": str(vendor.location.longitude),
                "city": vendor.location.city,
                "iban": vendor.iban,
                "rating": vendor.rating,
                "products": products
            }
    return JsonResponse(vendor_info, safe=False)
