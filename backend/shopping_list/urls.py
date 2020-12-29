from django.urls import path

from . import views

urlpatterns = [
    path('createlist/', views.create_shopping_list, name='create_shopping_list'),
    path('addtolist/', views.add_product_to_shopping_list, name='add_product_to_shopping_list'),
    path('deletelist/', views.delete_shopping_list, name='delete_shopping_list'),
    path('deletefromlist/', views.delete_product_from_shopping_list, name='delete_product_from_shopping_list'),
    path('getlists/', views.get_shopping_lists_of_customer, name='get_shopping_lists_of_customer'),
    path('products/', views.get_products_from_shopping_list, name='get_products_from_shopping_list'),
]
