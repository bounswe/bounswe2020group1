from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from product.models import Product
from order.models import Order
from registered_user.models import Customer



class Comment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    text = models.CharField(max_length=300, null=True)
    rating = models.IntegerField(validators=[MaxValueValidator(5), MinValueValidator(0)],null=False)
