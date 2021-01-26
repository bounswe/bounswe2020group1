from django.db import models
from django.contrib.auth.models import User
from product.models import Product
from registered_user.models import Customer, Vendor
from order.models import Order


class MessageFlowAdmin(models.Model):
    vendor = models.ForeignKey(Vendor,on_delete=models.CASCADE) #on_delete=models.CASCADE)
    admin = models.ForeignKey(User,on_delete=models.CASCADE)
    order = models.ForeignKey(Order, null=True, blank=True, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.CASCADE)
    vendor_read = models.BooleanField(default=True)
    admin_read = models.BooleanField(default=True)

class MessageFlowCustomer(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    vendor_read = models.BooleanField(default=True)
    customer_read = models.BooleanField(default=True)

class MessageHistoryAdmin(models.Model):
    flow = models.ForeignKey(MessageFlowAdmin, null=False, on_delete=models.CASCADE)
    from_admin = models.BooleanField(null=False)
    date_sent = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=200, null=False)

class MessageHistoryCustomer(models.Model):
    flow = models.ForeignKey(MessageFlowCustomer, null=False, on_delete=models.CASCADE)
    from_customer = models.BooleanField(null=False)
    date_sent = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=200, null=False)



