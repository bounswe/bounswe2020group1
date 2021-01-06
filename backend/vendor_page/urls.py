from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('public', views.public_vendor_page, name='public_vendor_page'),
]