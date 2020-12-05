from django.urls import path

from . import views

urlpatterns = [
    path('category/', views.category, name='category'),
    path('add/', views.add_product, name='add_product'),
]
