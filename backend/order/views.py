"""Views related to product"""
import os
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django import forms
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from product.models import Product, Category, Image
from registered_user.models import get_vendor_from_request, get_customer_from_request


@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def create_orders(request):
    """Edits product with given parameters when POST request is made."""
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
    items = ShoppingCarts.objects.filter(Q(customer=customer))
    for item in items:
        product = item.product
        vendor = item.product.vendor
        quantity = item.quantity
        order = Order.objects.create(product=product, vendor=vendor, customer=customer, quantity=quantity)
        order.save()
    ShoppingCarts.objects.filter(Q(customer=customer)).delete()
    
    return JsonResponse({}, safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_orders(request):
    """Edits product with given parameters when POST request is made."""
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
    
    items = Order.objects.filter(Q(customer=customer))
    static_url = "http://3.232.20.250/static/images/" # TODO Move this to conf
    orders = []
    for item in items:
        images = Image.objects.filter(product=item.product)
        if len(images) > 0:
            photo_url = f"{static_url}{images[0].photo}"
        else:
            photo_url = ""
        
        product_info = { "id": item.product.pk,
                    "name": item.product.name,
                    "photo_url": photo_url,
                    "vendor_name": item.product.vendor.user.user.first_name,
                    "category": item.product.category.name,
                    "rating": item.product.rating,
                    "stock": item.product.stock,
                    "price": item.product.price,
                    "brand": item.product.brand
                    }
        
        order_info = { "product": product_info, 
                    "quantity": item.quantity, 
                    "id": item.pk, 
                    "status": item.status, 
                    "cargoID": item.cargoID,
                    "estimatedArrivalDate": item.estimatedArrivalDate,
                    "arrivalDate": item.arrivalDate}

        orders.append(cart_info)

    return JsonResponse(orders, safe=False)


@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def set_delivered(request):
    """Edits product with given parameters when POST request is made."""
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
    try:
        order_id = request.POST["order_id"]
    except:
        return HttpResponse("Missing arguments", status=400)

    order = Order.objects.filter(id=order_id).first()
    if order == None:
        return HttpResponse("Invalid order_id", status=400)

    order.status = "delivered"
    order.arrivalDate = datetime.now()
    order.save()

    return JsonResponse({}, safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def set_delivery(request):
    """Setting the cargoId and delivery date"""
    vendor = get_vendor_from_request(request)
    if(customer is None):
        return HttpResponse("Vendor authentication failed", status=401)
    try:
        order_id = request.POST["order_id"]
    except:
        return HttpResponse("Missing arguments", status=400)

    try:
        days = int(request.POST["days"])
    except:
        return HttpResponse("Missing arguments", status=400)

    order = Order.objects.filter(id=order_id).first()
    if order == None:
        return HttpResponse("Invalid order_id", status=400)


    order.cargoID = cargo_id
    estimatedArrivalDate = datetime.now().timedelta(days=days)
    order.status = "in delivery"
    order.save()
    
    return JsonResponse({}, safe=False)