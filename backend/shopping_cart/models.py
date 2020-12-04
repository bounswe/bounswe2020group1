from django.db import models
from product.models import Product
from registered_user.models import Customer



class ShoppingCarts(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(null=False, default=1)
