from product.models import Product
from django.db import models
from registered_user.models import RegisteredUser
from product.models import Product

class Notification(models.Model):
    user = models.ForeignKey(RegisteredUser,on_delete=models.CASCADE)
    type = models.IntegerField(null=False)
    raw_data = models.TextField(default='{}', null=False)
    read = models.BooleanField(default=False, null=False)

class Alert(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    user = models.ForeignKey(RegisteredUser,on_delete=models.CASCADE)
    type = models.IntegerField(null=False)
    value = models.IntegerField(null=False)