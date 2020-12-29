from django.db import models
from product.models import Product
from registered_user.models import Customer, Vendor



class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    status = models.CharField(max_length=12, default="processing", null=False)
    cargoID = models.CharField(max_length=100, null=True)
    orderDate = models.DateField(auto_now_add=True)
    estimatedArrivalDate = models.DateField()
    arrivalDate = models.DateField()
    quantity = models.IntegerField(null=False, default=1)
    comment_added = models.BooleanField(default=False)
    created = models.DateTimeField(null=True)
    
