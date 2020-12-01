from django.db import models
from product.models import Product
from registered_user.models import Customer


class ProductLists(models.Model):
    name = models.CharField(max_length=100, null=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)

class ListedProducts(models.Model):
    product_list = models.ForeignKey(ProductLists, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
