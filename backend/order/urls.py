from django.urls import path

from . import views

urlpatterns = [
    path('create_orders/', views.create_orders, name='create_orders orders'),
    path('get_orders/', views.get_orders, name='get_orders'),
    path('set_delivered/', views.set_delivered, name='set_delivered'),
    path('delete/', views.delete_product, name='delete_product'),
    path('addphoto/', views.add_photo_to_product, name='add_photo_to_product'),
    path('deleteallphotos/', views.delete_all_photos_of_product, name='delete_all_photos_of_product'),
    path('deletephoto/', views.delete_photo_of_product_with_name, name='delete_photo_of_product_with_name'),
]
