"""Views related to order"""
import datetime

from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django.conf import settings
from django.utils import timezone
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

from product.models import Image
from shopping_cart.models import ShoppingCarts
from order.models import Order
from registered_user.models import get_vendor_from_request, get_customer_from_request

import notifications.utils as notif

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def create_orders(request):
    """Crete order from cart."""
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
    items = ShoppingCarts.objects.filter(Q(customer=customer))
    created_=datetime.datetime.now(tz=timezone.utc)
    invalid_list = []
    for item in items:
        product = item.product
        quantity = item.quantity
        if product.stock < quantity:
            invalid_list.append(str(product.name))
    if(len(invalid_list) > 0):
        return JsonResponse({"invalid": invalid_list}, safe=False)
    
    for item in items:
        product = item.product
        vendor = item.product.vendor
        quantity = item.quantity
        order = Order.objects.create(product=product, 
            vendor=vendor, customer=customer, 
            quantity=quantity,
            estimatedArrivalDate=datetime.date.today(), 
            arrivalDate=datetime.date.today(),
            created=created_)
        product.stock -= quantity
        customer.money_spent += quantity * product.price
        product.save()
        order.save()
        notif.insert_order_status_change(vendor.user, product.name, order.id, "new")

    ShoppingCarts.objects.filter(Q(customer=customer)).delete()

    return JsonResponse({}, safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_orders(request):
    """Get the list of all orders"""
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
    
    items = Order.objects.filter(Q(customer=customer)).order_by('created')
    static_url = settings.TURSU_STATIC_URL
    orders = []
    group = []
    index = 0
    for index in range(len(items)):
        if index > 0 and items[index - 1].created != items[index].created:
            orders.append(group)
            group = []
        item = items[index]
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
        group.append(order_info)

    if len(group) > 0:
        orders.append(group)

    orders.sort(key=lambda x: x[0].get('id'))
    orders.reverse()
    return JsonResponse(orders, safe=False)


@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def set_delivered(request):
    """Sets and order as delivered."""
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
    order.arrivalDate = datetime.date.today()
    order.save()
    
    # add notification for vendor
    notif.insert_order_status_change(order.vendor.user, order.product.name, order.id, "delivered")
    
    return JsonResponse({}, safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def set_delivery(request):
    """Sets and order as in delivery"""
    vendor = get_vendor_from_request(request)
    if(vendor is None):
        return HttpResponse("Vendor authentication failed", status=401)
    try:
        order_id = request.POST["order_id"]
        cargo_id = request.POST["cargo_id"]
        days = int(request.POST["days"])
    except:
        return HttpResponse("Missing arguments", status=400)
    
    order = Order.objects.filter(id=order_id).first()
    if order == None:
        return HttpResponse("Invalid order_id", status=400)

    order.cargoID = cargo_id
    order.estimatedArrivalDate = datetime.date.today() + datetime.timedelta(days=days)
    order.status = "in delivery"
    order.save()

    # add notification for customer
    notif.insert_order_status_change(order.customer.user, order.product.name, order.id, "in delivery")
    
    return JsonResponse({}, safe=False)


@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def cancel_order(request):
    """Sets and order as cancelled"""
    vendor = get_vendor_from_request(request)
    customer = get_customer_from_request(request)
    if(vendor is None and customer is None):
        return HttpResponse("Authentication failed", status=401)
    try:
        order_id = request.POST["order_id"]
    except:
        return HttpResponse("Missing arguments", status=400)
    
    order = Order.objects.filter(id=order_id).first()
    if order == None:
        return HttpResponse("Invalid order_id", status=400)

    if order.customer == customer or order.vendor == vendor:
        if order.status == "cancelled":
            return HttpResponse("Order is already cancelled", status=400)
        order.status = "cancelled"
        order.product.stock += order.quantity
        order.customer.money_spent -= order.quantity * order.product.price
    else: 
        return HttpResponse("Order doesn't belong to given user", status=400)
    
    order.product.save()
    order.save()
    order.customer.save()

    # add notification
    if vendor is None:
        notif.insert_order_status_change(order.vendor.user, order.product.name, order.id, "cancelled")
    if customer is None:
        notif.insert_order_status_change(order.customer.user, order.product.name, order.id, "cancelled")

    return JsonResponse({}, safe=False)