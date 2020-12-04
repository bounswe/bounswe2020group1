from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class RegisteredUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    is_banned = models.BooleanField(default=False)


class Location(models.Model):
    latitude = models.DecimalField(max_digits=8, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)


class Vendor(models.Model):
    user = models.OneToOneField(RegisteredUser, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, null=True)
    iban = models.CharField(max_length=60, null=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1)


class Customer(models.Model):
    user = models.OneToOneField(RegisteredUser, on_delete=models.CASCADE)
    money_spent = models.DecimalField(max_digits=15, decimal_places=2)


@receiver(post_save, sender=User)
def create_registered_user(sender, instance, created, **kwargs):
    if created:
        RegisteredUser.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_registered_user(sender, instance, **kwargs):
    instance.registereduser.save()
