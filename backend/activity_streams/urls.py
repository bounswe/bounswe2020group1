from django.urls import path

from . import views

urlpatterns = [
    path('vendor/', views.vendors, name='vendor activity stream'),
    path('product/', views.products, name='product activity stream'),
]
