from django.http import JsonResponse, HttpResponse
from django.db.models import Q
from django import forms
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from product.models import Product
from order.models import Order
from comment.models import Comment
from shopping_list.models import ProductLists
from registered_user.models import Customer, get_customer_from_request

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET']) 
def index(request):
    customer = get_customer_from_request(request)
    if(customer is None):
        return HttpResponse("Customer authentication failed", status=401)
    
    orders = Order.objects.filter(Q(customer=customer))
    my_orders = []
    for order in orders:
        comment = Comment.objects.filter(Q(order=order))
        if len(comment) == 0:
            comment = ""
        else:
            comment = comment[0].text
            
        order_info = {
                "id": order.id,
                "vendor": order.vendor.user.user.first_name,
                "product": order.product.pk,
                "status": order.status,
                "cargoID": order.cargoID,
                "orderDate": order.orderDate,
                "estimatedArrivalDate": order.estimatedArrivalDate,
                "arrivalDate": order.arrivalDate,
                "quantity": order.quantity,
                "comment": comment
            }
        my_orders.append(order_info)
    my_orders.sort(key=lambda x: x.get('id'))
    my_orders.reverse()
    
    lists = [product_list.name for product_list in ProductLists.objects.filter(customer=customer)]
        
    customer_info = {"username": customer.user.user.username,
                "email": customer.user.user.email,
                "first_name": customer.user.user.first_name,
                "last_name": customer.user.user.last_name,
                "money_spent": customer.money_spent,
                "orders": my_orders,
                "lists": lists
            }
            
    return JsonResponse(customer_info, safe=False)
