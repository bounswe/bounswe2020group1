from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class RegisteredUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    is_vendor = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)


@receiver(post_save, sender=User)
def create_registered_user(sender, instance, created, **kwargs):
    if created:
        RegisteredUser.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_registered_user(sender, instance, **kwargs):
    instance.registereduser.save()
