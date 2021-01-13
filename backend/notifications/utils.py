import json

"""Views related to order"""
import datetime

from django.db.models import Q

from product.models import Product
from notifications.models import Notification, Alert
from notifications.types import NotificationType, AlertType
from registered_user.models import RegisteredUser

def get_notification_data_dict(raw_data: str):
    return json.loads(raw_data)


def get_notification_raw_data(notification_dict: dict):
    return json.dumps(notification_dict)

def insert_notification(registered_user: RegisteredUser, type: int, raw_data: str):
    print("anan yani neden save etmiyosun")
    notification = Notification.objects.create(user=registered_user, 
                                               type=type,
                                               raw_data=raw_data, 
                                               read = False)
    notification.save()


def set_notification_read(registered_user: RegisteredUser, type: int, raw_data: str):
    item = Notification.objects.filter(Q(user=registered_user,
                                          type=type,
                                          raw_data=raw_data)).first()
    if item is None:
        return
    item.read = True
    item.save()


def set_notification_read_with_id(id: int):
    item = Notification.objects.filter(Q(id=id)).first()
    if item is None:
        return
    item.read = True
    item.save()



def insert_order_status_change(registered_user: RegisteredUser, product_name: str, order_id: int, status: str):
    notification_data = {'product_name': product_name,
                         'order_id': order_id,
                         'status': status }   
    raw_data = get_notification_raw_data(notification_data)
    insert_notification(registered_user, NotificationType.ORDER_STATUS_CHANGE.value, raw_data)


def insert_product_verified(registered_user: RegisteredUser, product_name: str, product_id: int):
    notification_data = {
                         'product_name': product_name,
                         'product_id': product_id,
                        }   
    raw_data = get_notification_raw_data(notification_data)
    insert_notification(registered_user, NotificationType.PRODUCT_VERIFIED.value, raw_data)


def insert_product_change(registered_user: RegisteredUser, product_name: str, product_id: int, value: int, alert_type: int):
    notification_data = {
                         'product_name': product_name,
                         'product_id': product_id,
                         'new_value': value,
                        }   
    raw_data = get_notification_raw_data(notification_data)
    notif_type = NotificationType.PRICE_CHANGE_ALERT.value
    if alert_type == AlertType.PRICE_BELOW_ALERT.value:
        notif_type = NotificationType.PRICE_BELOW_ALERT.value
    if alert_type == AlertType.STOCK_ABOVE_ALERT.value:
        notif_type = NotificationType.STOCK_ABOVE_ALERT.value
    insert_notification(registered_user, notif_type, raw_data)


def handle_stock_change(product: Product):
    items = Alert.objects.filter(Q(product=product, type=AlertType.STOCK_ABOVE_ALERT.value, value__lte=product.stock))
    for item in items:
        insert_product_change(item.user, product.name, product.id, product.stock, AlertType.STOCK_ABOVE_ALERT)
    items.delete()


def handle_price_change(product: Product):
    items = Alert.objects.filter(Q(product=product, type=AlertType.PRICE_CHANGE_ALERT.value))
    for item in items:
        insert_product_change(item.user, product.name, product.id, product.price, AlertType.PRICE_CHANGE_ALERT.value)
    items.delete()
    items = Alert.objects.filter(Q(product=product, type=AlertType.PRICE_BELOW_ALERT.value, value__gte=product.price))
    for item in items:
        insert_product_change(item.user, product.name, product.id, product.price, AlertType.PRICE_BELOW_ALERT.value)
    items.delete()