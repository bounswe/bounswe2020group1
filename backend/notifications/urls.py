from django.urls import path

from . import views

urlpatterns = [
    path('get_notifications', views.get_notifications, name='get_notifications'),
    path('set_read', views.set_read, name='set_read'),
    path('get_alerts', views.get_alerts, name='get_alerts'),
    path('delete_alert', views.delete_alert, name='delete_alert'),
    path('create_alert', views.create_alert, name='create_alert'),
]
