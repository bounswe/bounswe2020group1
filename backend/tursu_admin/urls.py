from django.urls import path

from . import views

urlpatterns = [
    path('verificationpending/products/', views.get_products_waiting_verification, name='verification pending products'),
    path('removeproduct/', views.delete_product, name='admin removing products'),
    path('verifyproduct/', views.delete_product, name='admin verifying products'),
]