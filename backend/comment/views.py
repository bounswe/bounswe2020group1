from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django import forms
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from product.models import Product
from order.models import Order
from comment.models import Comment
from registered_user.models import Customer, get_customer_from_request

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST']) 
def add(request):
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
        
    try:
        product_id = int(request.POST.get('product_id'))
    except (KeyError, ValueError, TypeError):
        return HttpResponse("Product id (product_id) not given or invalid", status=400)
        
    try:
        text = request.POST.get('text')
    except (KeyError, ValueError):
        return HttpResponse("Comment not given or invalid", status=400)
        
    try:
        product_rating = int(request.POST.get('product_rating'))
    except (KeyError, ValueError, TypeError):
        return HttpResponse("Product rating not given or invalid", status=400)
    
    try:
        vendor_rating = int(request.POST.get('vendor_rating'))
    except (KeyError, ValueError):
        return HttpResponse("Vendor rating not given or invalid", status=400)
        
    product = Product.objects.filter(Q(id=product_id))
    if len(product) == 0:
        return HttpResponse('There is no such product.',status=400)
    else:
        product = product[0] 
        
    order = Order.objects.filter(Q(customer=customer, product=product, comment_added=False))
    if len(order) == 0:
        return HttpResponse('The customer did not buy the product or comment already added.',status=401)
    else:
        order = order[0] 
        try:
            comment = Comment.objects.create(order=order, product = product, customer=customer, text=text, rating=product_rating)
            comment.save()
            product.rating = ((product.rating * product.number_of_raters) + product_rating) / (product.number_of_raters + 1)
            product.number_of_raters = product.number_of_raters + 1
            product.save()
            vendor = order.vendor
            rated_orders = Order.objects.filter(Q(vendor=vendor, comment_added=True))
            num_of_raters = len(rated_orders)
            vendor.rating = ((vendor.rating * num_of_raters) + vendor_rating) / (num_of_raters + 1)
            order.comment_added = True
            vendor.save()
            order.save()
        except Exception:
            return HttpResponse("Comment cannot be added.", status=400)
    
    return HttpResponse("success")
