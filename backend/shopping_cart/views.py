from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django import forms
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from product.models import Product
from shopping_cart.models import ShoppingCarts
from registered_user.models import get_customer_from_request

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST']) 
def add(request):
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
        
    product_id = request.POST.get('product_id')
    quantity = request.POST.get('quantity')
    
    if (not product_id):
        return HttpResponse("Please provide a product_id and quantity", status=400)

    if (not quantity):
        quantity = 1

    product = Product.objects.filter(Q(id=product_id))
    if len(product) == 0:
        return HttpResponse('There is no such product.',status=400)
    else:
        product = product[0] 

    try:
        items = ShoppingCarts.objects.filter(Q(product=product_id, customer=customer))
        if len(items) == 0:
            item = ShoppingCarts.objects.create(product=product, customer=customer, quantity=quantity)
            item.save()
        else:
            items[0].quantity = quantity
            print("selam ben buraya geldim")
            items[0].save()
    except Exception:
        return HttpResponse("Product can not be added to the shopping cart of current user", status=400)
        
    return HttpResponse("success")
    

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['DELETE']) 
def delete(request):
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
        
    product_id = request.POST.get('product_id')
    
    if (not product_id):
        return HttpResponse("Please provide a product_id", status=400)

    product = Product.objects.filter(Q(id=product_id))
    ShoppingCarts.objects.filter(Q(product=product_id, customer=customer)).delete()
    return HttpResponse("success")

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET']) 
def all(request):
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
        
    try:
        items = ShoppingCarts.objects.filter(Q(customer=customer))
       
        cart = []
        for item in items:
            cart_info = {"product": item.product.pk,
                         "quantity": item.quantity
                        }
            cart.append(cart_info)
    
    except Exception:
        return HttpResponse("Could not fetch the items from shopping cart", status=400)
    
    return JsonResponse(cart, safe=False)
