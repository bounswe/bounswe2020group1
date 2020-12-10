"""Views related to messaging"""
from django.http import JsonResponse, HttpResponse
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from shopping_list.models import ProductLists, ListedProducts
from product.models import Product, Image
from order.models import Order
from registered_user.models import(
    Vendor,
    Customer,
    get_customer_from_request,
    get_vendor_from_request,
    get_admin_from_request,
    get_admin
)
from messaging.models import (
    MessageFlowAdmin,
    MessageFlowCustomer,
    MessageHistoryAdmin,
    MessageHistoryCustomer
)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def customer_message_to_vendor(request):
    """Customer sending message to vendor"""
    customer = get_customer_from_request(request)
    if customer is None:
        return HttpResponse("Customer authentication failed", status=401)
    flow_id = request.POST.get("flow_id")
    if flow_id is None:
        return HttpResponse("Flow id is not given", status=400)
    try:
        flow = MessageFlowCustomer.objects.get(id=flow_id)
    except:
        return HttpResponse("Flow does not exist", status=400)
    if flow.customer != customer:
        return HttpResponse("Customer authentication failed", status=401)
    message_text = request.POST.get("message")
    if message_text is None:
        return HttpResponse("Message is not given", status=400)
    elif len(message_text) > 200:
        return HttpResponse("Message is too long (LIMIT=200 char)", status=400)
    message = MessageHistoryCustomer.objects.create(
            flow=flow,
            from_customer=True,
            message=message_text
        )
    message.save()
    flow.vendor_read = False
    flow.save()
    return HttpResponse("Message sent successfully!")

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def vendor_message_to_customer(request):
    """Vendor sending message to customer"""
    vendor = get_vendor_from_request(request)
    if vendor is None:
        return HttpResponse("Vendor authentication failed", status=401)
    flow_id = request.POST.get("flow_id")
    if flow_id is None:
        return HttpResponse("Flow id is not given", status=400)
    try:
        flow = MessageFlowCustomer.objects.get(id=flow_id)
    except:
        return HttpResponse("Flow does not exist", status=400)
    if flow.vendor != vendor:
        return HttpResponse("Vendor authentication failed", status=401)
    message_text = request.POST.get("message")
    if message_text is None:
        return HttpResponse("Message is not given", status=400)
    elif len(message_text) > 200:
        return HttpResponse("Message is too long (LIMIT=200 char)", status=400)
    message = MessageHistoryCustomer.objects.create(
            flow=flow,
            from_customer=False,
            message=message_text
        )
    message.save()
    flow.customer_read = False
    flow.save()
    return HttpResponse("Message sent successfully!")

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def vendor_message_to_admin(request):
    """Vendor sending message to admin"""
    vendor = get_vendor_from_request(request)
    if vendor is None:
        return HttpResponse("Vendor authentication failed", status=401)
    flow_id = request.POST.get("flow_id")
    if flow_id is None:
        return HttpResponse("Flow id is not given", status=400)
    try:
        flow = MessageFlowAdmin.objects.get(id=flow_id)
    except:
        return HttpResponse("Flow does not exist", status=400)
    if flow.vendor != vendor:
        return HttpResponse("Vendor authentication failed", status=401)
    message_text = request.POST.get("message")
    if message_text is None:
        return HttpResponse("Message is not given", status=400)
    elif len(message_text) > 200:
        return HttpResponse("Message is too long (LIMIT=200 char)", status=400)
    message = MessageHistoryAdmin.objects.create(
            flow=flow,
            from_admin=False,
            message=message_text
        )
    message.save()
    flow.admin_read = False
    flow.save()
    return HttpResponse("Message sent successfully!")

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def admin_message_to_vendor(request):
    """Admin sending message to vendor"""
    admin = get_admin_from_request(request)
    if admin is None:
        return HttpResponse("Admin authentication failed", status=401)
    flow_id = request.POST.get("flow_id")
    if flow_id is None:
        return HttpResponse("Flow id is not given", status=400)
    try:
        flow = MessageFlowAdmin.objects.get(id=flow_id)
    except:
        return HttpResponse("Flow does not exist", status=400)
    #if flow.admin != admin:
    #    return HttpResponse("Admin authentication failed", status=401)
    message_text = request.POST.get("message")
    if message_text is None:
        return HttpResponse("Message is not given", status=400)
    elif len(message_text) > 200:
        return HttpResponse("Message is too long (LIMIT=200 char)", status=400)
    message = MessageHistoryAdmin.objects.create(
            flow=flow,
            from_admin=True,
            message=message_text
        )
    message.save()
    flow.vendor_read = False
    flow.save()
    return HttpResponse("Message sent successfully!")


#@authentication_classes([SessionAuthentication, BasicAuthentication])
#@permission_classes((IsAuthenticated,))
#@api_view(['POST'])
#def create_flow_vendor_customer(request):
#    vendor = get_vendor_from_request(request)
#    if(vendor is None):
#        return HttpResponse("Vendor authentication failed", status=401)
#    username = request.POST.get("username")
#    if username is None:
#        return HttpResponse("Username is not given", status=400)
#    try:
#        customer = Customer.objects.get(user__user__username=username)
#    except:
#        return HttpResponse("Customer does not exist", status=400)
#    flow, _ = MessageFlowCustomer.objects.get_or_create(
#            customer=customer,
#            vendor=vendor
#        )
#    flow.save()
#    return HttpResponse("Flow created successfully")

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def create_flow_customer_vendor(request):
    """Customer creating message flow to message vendor"""
    customer = get_customer_from_request(request)
    if customer is None:
        return HttpResponse("Customer authentication failed", status=401)
    vendor_name = request.POST.get("vendor_name")
    if vendor_name is None:
        return HttpResponse("Vendor name is not given", status=400)
    try:
        vendor = Vendor.objects.get(user__user__first_name=vendor_name)
    except:
        return HttpResponse("Vendor does not exist", status=400)
    orders = Order.objects.filter(customer=customer, vendor=vendor)
    if len(orders) == 0:
        return HttpResponse("You can't message vendors that you haven't ordered from", status=400)
    flow, _ = MessageFlowCustomer.objects.get_or_create(
            customer=customer,
            vendor=vendor
        )
    flow.save()
    return HttpResponse("Flow created successfully")

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def create_flow_vendor_admin(request):
    """Vendor creating message flow to message admin"""
    admin = get_admin()
    vendor = get_vendor_from_request(request)
    if vendor is None:
        return HttpResponse("Vendor authentication failed", status=401)
    context = request.POST.get("context")
    object_id = request.POST.get("object_id")
    if context is None:
        return HttpResponse("Message context is not given", status=400)
    if object_id is None:
        return HttpResponse("Object id is not given", status=400)
    if context == "product":
        try:
            product = Product.objects.get(id=object_id)
        except:
            return HttpResponse("Product with given object_id does not exist", status=400)
        if product.vendor != vendor:
            return HttpResponse("Cannot create a message flow with other vendors' product",
                status=400)
        flow, _ = MessageFlowAdmin.objects.get_or_create(
                vendor=vendor,
                admin=admin,
                product=product,
            )
        flow.save()
        return HttpResponse("Flow created successfully")
    elif context == "order":
        try:
            order = Order.objects.get(id=object_id)
        except:
            return HttpResponse("Order with given object_id does not exist", status=400)
        if order.vendor != vendor:
            return HttpResponse("Cannot create a message flow with other vendors' order",
                status=400)
        flow, _ = MessageFlowAdmin.objects.get_or_create(
                vendor=vendor,
                admin=admin,
                order=order,
            )
        flow.save()
        return HttpResponse("Flow created successfully")
    else:
        return HttpResponse("Invalid context type",status=400)


@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_customer_flows(request):
    """GET requests to get MessageFlows of Customer requestsing"""
    customer = get_customer_from_request(request)
    if customer is None:
        return HttpResponse("Customer authentication failed", status=401)
    flows = MessageFlowCustomer.objects.filter(customer=customer)
    info = []
    for flow in flows:
        info.append({
            "id": flow.pk,
            "notify": True if not flow.customer_read else False,
            "vendor_name": flow.vendor.user.user.first_name,
        })
    return JsonResponse(info,safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_vendor_flows(request):
    """GET requests to get MessageFlows of Vendor requestsing"""
    vendor = get_vendor_from_request(request)
    if vendor is None:
        return HttpResponse("Vendor authentication failed", status=401)
    flow_dict = {}
    flows = MessageFlowCustomer.objects.filter(vendor=vendor)
    cinfo = []
    for flow in flows:
        cinfo.append({
            "id": flow.pk,
            "notify": True if not flow.vendor_read else False,
            "username": flow.vendor.user.user.username,
            "type": "customer"
        })
    flow_dict["customer_flows"] =  cinfo
    flows = MessageFlowAdmin.objects.filter(vendor=vendor)
    ainfo = []
    for flow in flows:
        if flow.product is None:
            context = "order"
            object_id = flow.order.pk
        else:
            context = "product"
            object_id = flow.product.pk
        ainfo.append({
            "id": flow.pk,
            "notify": True if not flow.vendor_read else False,
            "context": context,
            "object_id": object_id,
            "type": "admin"
        })
    flow_dict["admin_flows"] =  ainfo
    return JsonResponse(flow_dict,safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_admin_flows(request):
    """GET requests to get MessageFlows of Admin requestsing"""
    admin = get_admin_from_request(request)
    if admin is None:
        return HttpResponse("Admin authentication failed", status=401)
    flows = MessageFlowAdmin.objects.filter(admin=admin)
    info = []
    for flow in flows:
        if flow.product is None:
            context = "order"
            object_id = flow.order.pk
        else:
            context = "product"
            object_id = flow.product.pk
        info.append({
            "id": flow.pk,
            "notify": True if not flow.admin_read else False,
            "context": context,
            "object_id": object_id,
            "type": "admin"
        })
    return JsonResponse(info,safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_messages_from_flow_customer(request):
    """GET requests for customer to get messages from message flow"""
    customer = get_customer_from_request(request)
    if customer is None:
        return HttpResponse("Customer authentication failed", status=401)
    flow_id = request.GET.get("flow_id")
    if flow_id is None:
        return HttpResponse("Flow id not given", status=400)
    try:
        flow = MessageFlowCustomer.objects.get(id=flow_id)
    except:
        return HttpResponse("Flow with id does not exist", status=400)
    if flow.customer!=customer:
        return HttpResponse("Customer authentication failed", status=401)
    messages = MessageHistoryCustomer.objects.filter(flow=flow).order_by("date_sent")
    data = []
    for message in messages:
        data.append({
            "sender": "self" if message.from_customer else "other",
            "customer": flow.customer.user.user.username,
            "vendor_name": flow.vendor.user.user.first_name,
            "message": message.message,
            "date_sent": message.date_sent,
        })
    return JsonResponse(data, safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_messages_from_admin_flow_vendor(request):
    """GET requests for vendor to get messages from admin message flow"""
    vendor = get_vendor_from_request(request)
    if vendor is None:
        return HttpResponse("Vendor authentication failed", status=401)
    flow_id = request.GET.get("flow_id")
    if flow_id is None:
        return HttpResponse("Flow id not given", status=400)
    try:
        flow = MessageFlowAdmin.objects.get(id=flow_id)
    except:
        return HttpResponse("Flow with id does not exist", status=400)
    if flow.vendor!=vendor:
        return HttpResponse("Vendor authentication failed", status=401)
    messages = MessageHistoryAdmin.objects.filter(flow=flow).order_by("date_sent")
    data = []
    for message in messages:
        data.append({
            "sender": "self" if not message.from_admin else "other",
            "admin": flow.admin.username,
            "vendor_name": flow.vendor.user.user.first_name,
            "message": message.message,
            "date_sent": message.date_sent,
        })
    return JsonResponse(data, safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_messages_from_customer_flow_vendor(request):
    """GET requests for vendor to get messages from customer message flow"""
    vendor = get_vendor_from_request(request)
    if vendor is None:
        return HttpResponse("Vendor authentication failed", status=401)
    flow_id = request.GET.get("flow_id")
    if flow_id is None:
        return HttpResponse("Flow id not given", status=400)
    try:
        flow = MessageFlowCustomer.objects.get(id=flow_id)
    except:
        return HttpResponse("Flow with id does not exist", status=400)
    if flow.vendor!=vendor:
        return HttpResponse("Vendor authentication failed", status=401)
    messages = MessageHistoryCustomer.objects.filter(flow=flow).order_by("date_sent")
    data = []
    for message in messages:
        data.append({
            "sender": "self" if not message.from_customer else "other",
            "customer": flow.customer.user.user.username,
            "vendor_name": flow.vendor.user.user.first_name,
            "message": message.message,
            "date_sent": message.date_sent,
        })
    return JsonResponse(data, safe=False)

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_messages_from_flow_admin(request):
    """GET requests for admin to get messages from message flow"""
    admin = get_admin_from_request(request)
    if admin is None:
        return HttpResponse("Admin authentication failed", status=401)
    flow_id = request.GET.get("flow_id")
    if flow_id is None:
        return HttpResponse("Flow id not given", status=400)
    try:
        flow = MessageFlowAdmin.objects.get(id=flow_id)
    except:
        return HttpResponse("Flow with id does not exist", status=400)
    #if flow.admin!=admin:
    #    return HttpResponse("Message does not belong to this admin", status=401)
    messages = MessageHistoryAdmin.objects.filter(flow=flow).order_by("date_sent")
    data = []
    for message in messages:
        data.append({
            "sender": "self" if message.from_admin else "other",
            "admin": flow.admin.username,
            "vendor_name": flow.vendor.user.user.first_name,
            "message": message.message,
            "date_sent": message.date_sent,
        })
    return JsonResponse(data, safe=False)
