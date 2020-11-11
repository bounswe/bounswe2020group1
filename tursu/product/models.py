from django.db import models
from registered_user.models import RegisteredUser


class Category(models.Model):
    name = models.CharField(max_length=50, null=False)


class Product(models.Model):
    vendor = models.ForeignKey(RegisteredUser, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=False)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    stock = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=12, decimal_places=2)
