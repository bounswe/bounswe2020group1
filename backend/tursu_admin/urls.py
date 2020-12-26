from django.urls import path

from . import views

urlpatterns = [
    path('verificationpending/products/', views.get_products_waiting_verification, name='verification pending products'),
    path('removeproduct/', views.delete_product, name='admin removing products'),
    path('verifyproduct/', views.verify_product, name='admin verifying products'),
    path('banuser/', views.ban_user, name='admin ban user'),
    path('deletecomment/', views.delete_comment, name='admin deleting comments'),
]
