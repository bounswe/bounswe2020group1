from django.urls import path

from . import views

urlpatterns = [
    path('create_orders/', views.create_orders, name='create_orders orders'),
    path('get_orders/', views.get_orders, name='get_orders'),
    path('set_delivered/', views.set_delivered, name='set_delivered'),
    path('set_delivery/', views.set_delivery, name='set_delivery'),
    path('cancel_order/', views.cancel_order, name='cancel_order'),
 ]
