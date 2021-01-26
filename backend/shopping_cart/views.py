from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django.conf import settings
from django import forms
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from product.models import Product, Image
from shopping_cart.models import ShoppingCarts
from registered_user.models import get_customer_from_request

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST']) 
def add(request):
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
        
    try:
        product_id = int(request.POST["product_id"])
    except (KeyError, ValueError):
        return HttpResponse("Product id (product_id) not given or invalid", status=400)

    quantity = request.POST.get('quantity') 
    if (not quantity):
        quantity = 1
    else:
        try:
            quantity = int(quantity)
        except (KeyError, ValueError):
            return HttpResponse("Given quantity is not an integer", status=400)

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
            items[0].save()
    except Exception:
        return HttpResponse("Product can not be added to the shopping cart of current user", status=400)
        
    return HttpResponse("success")
    

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST']) 
def increase(request):
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
    try:
        product_id = int(request.POST["product_id"])
        product = Product.objects.filter(Q(id=product_id))[0]
    except Exception:
        return HttpResponse("Product id (product_id) not given or invalid", status=400)

    items = ShoppingCarts.objects.filter(Q(product=product_id, customer=customer))
    if len(items) == 0:
        item = ShoppingCarts.objects.create(product=product, customer=customer, quantity=1)
        item.save()
    else:
        items[0].quantity = items[0].quantity + 1
        items[0].save()
       
    return HttpResponse("success")
    
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST']) 
def decrease(request):
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
    try:
        product_id = int(request.POST["product_id"])
        product = Product.objects.filter(Q(id=product_id))[0]
    except Exception:
        return HttpResponse("Product id (product_id) not given or invalid", status=400)

    items = ShoppingCarts.objects.filter(Q(product=product_id, customer=customer))
    if len(items) == 0:
        return HttpResponse("success")
    else:
        items[0].quantity = items[0].quantity - 1
        items[0].save()
        if items[0].quantity == 0:
            items[0].delete()    
    return HttpResponse("success")

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['DELETE','POST']) 
def delete(request):
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
        
    try:
        product_id = int(request.POST["product_id"])
    except (KeyError, ValueError):
        return HttpResponse("Product id (product_id) not given or invalid", status=400)

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
        
    items = ShoppingCarts.objects.filter(Q(customer=customer))
    static_url = settings.TURSU_STATIC_URL
    cart = []

    for item in items:
        images = Image.objects.filter(product=item.product)
        if len(images) > 0:
            photo_url = f"{static_url}{images[0].photo}"
        else:
            photo_url = ""
        
        product_info ={"id": item.product.pk,
                    "name": item.product.name,
                    "photo_url": photo_url,
                    "vendor_name": item.product.vendor.user.user.first_name,
                    "category": item.product.category.name,
                    "rating": item.product.rating,
                    "stock": item.product.stock,
                    "price": item.product.price,
                    "brand": item.product.brand
                    }
        
        cart_info = {"product": product_info,
                        "quantity": item.quantity
                    }
        cart.append(cart_info)

    
    return JsonResponse(cart, safe=False)
