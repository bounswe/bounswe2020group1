from django.db import models
from registered_user.models import Vendor


class Category(models.Model):
    name = models.CharField(max_length=50, null=False)


class Product(models.Model):
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=False)
    brand = models.CharField(max_length=100, default="")
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    number_of_raters = models.PositiveIntegerField(default=0)
    stock = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    date_added = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    def __str__(self):
        import json
        product = {
            "@context": "TURSU.PRODUCT",
            "vendor": self.vendor,
            "category": self.category.name,
            "username": self.vendor.user.user.username,
            "name": self.name,
            "brand": self.brand,
            "description": self.description,
            "rating": float(self.rating),
            "number_of_raters": self.number_of_raters,
            "stock": self.stock,
            "price": float(self.price),
            "date_added": str(self.date_added),
            "is_verified": self.is_verified
        }
        return str(product)


class Image(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='products/')
