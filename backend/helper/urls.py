from django.urls import path

from . import views

urlpatterns = [
    path('allcategories/', views.allcategories, name='all categories'),
    path('allvendors/', views.allvendors, name='all vendors'),
    path('allbrands/', views.allbrands, name='all brands'),
]
