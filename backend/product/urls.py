from django.urls import path

from . import views

urlpatterns = [
    path('category/', views.category, name='category'),
    path('add/', views.add_product, name='add_product'),
    path('edit/', views.edit_product, name='edit_product'),
    path('delete/', views.delete_product, name='delete_product'),
]
