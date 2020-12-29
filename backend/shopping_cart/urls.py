from django.urls import path

from . import views

urlpatterns = [
    path('add', views.add, name='add to shopping cart'),
    path('delete', views.delete, name='delete from shopping cart'),
    path('all', views.all, name='get all items from shopping cart'),
    path('increase', views.increase, name='increase'),
    path('decrease', views.decrease, name='decrease')
]