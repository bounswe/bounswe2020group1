"""Views related to notifications"""
from registered_user.models import get_registered_user_from_request
from django.http import JsonResponse, HttpResponse

from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

import notifications.utils as notification_utils
from notifications.models import Notification, Alert
from product.models import Product
from registered_user.models import get_registered_user_from_request

@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_notifications(request):
    """Returns a notification list"""
    registered_user = get_registered_user_from_request(request)
    if registered_user is None:
        return HttpResponse("Non existing user", status=401)
    notifications = Notification.objects.filter(Q(registered_user=registered_user)).order_by('created')
    notification_list = []
    for notification in notifications:
        notification_dict = notification_utils.get_notification_data_dict(notification.raw_data)
        notification_dict['id'] = notification.id
        notification_dict['type'] = notification.type
        notification_list.append(notification_dict)
    return JsonResponse(notification_list, safe=False)

    
@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def set_read(request):
    """Sets given notification as read"""
    registered_user = get_registered_user_from_request(request)
    if registered_user is None:
        return HttpResponse("Non existing user", status=401)
    notification = Notification.objects.filter(Q(id=id)).first()
    if notification is None:
        return HttpResponse("Invalid notification id", status=400)
    if notification.registered_user !=  registered_user:
        return HttpResponse("No authorization for given notification", status=401)
    notification.read = True
    notification.save()
    return JsonResponse({}, safe=False)



@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['GET'])
def get_alerts(request):
    """Gets all active alerts"""
    registered_user = get_registered_user_from_request(request)
    if registered_user is None:
        return HttpResponse("Non existing user", status=401)
    alerts = Alert.objects.filter(Q(registered_user=registered_user))
    alerts_list = []
    for alert in alerts:
        alerts_list.append({
            'type': alert.type,
            'value': alert.value,
            'product_id': alert.product.id,
            'product_name': alert.product.name,
        })
    return JsonResponse(alerts_list, safe=False)


@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['DELETE','POST'])
def delete_alert(request):
    """Deletes given alert"""
    registered_user = get_registered_user_from_request(request)
    if registered_user is None:
        return HttpResponse("Non existing user", status=401)
    alert = Alert.objects.filter(Q(id=id, registered_user=registered_user)).first()
    if alert is not None:
        alert.delete()
    return JsonResponse({}, safe=False)


@authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes((IsAuthenticated,))
@api_view(['POST'])
def create_alert(request):
    """Creates an alert"""
    registered_user = get_registered_user_from_request(request)
    if registered_user is None:
        return HttpResponse("Non existing user", status=401)
    try:
        product_id = request.POST["product_id"]
        product = Product.objects.filter(q(id=product_id)).first()
        type = request.POST["type"]
        value = request.POST["value"]
    except:
        return HttpResponse("Missing argument(s)", status=400)
    if product is None:
        return HttpResponse("Invalid product id", status=400)
    alert = Alert.objects.create(registered_user=registered_user, 
                                 type=type,
                                 value=value,
                                 product=product)
    alert.save()
    return JsonResponse({}, safe=False)
