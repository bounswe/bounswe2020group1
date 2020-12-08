from django.urls import path

from . import views

urlpatterns = [
    path('category/', views.category, name='category'),
    path('add/', views.add_product, name='add_product'),
    path('edit/', views.edit_product, name='edit_product'),
    path('delete/', views.delete_product, name='delete_product'),
    path('addphoto/', views.add_photo_to_product, name='add_photo_to_product'),
    path('deletephotos/', views.delete_all_photos_of_product, name='delete_all_photos_of_product'),
]
