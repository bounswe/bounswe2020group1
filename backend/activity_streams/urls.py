from django.urls import path

from . import views

urlpatterns = [
    path('vendor/', views.vendors, name='all vendors'),
    path('product/', views.products, name='all categories'),
]
