from django.urls import path

from . import views

urlpatterns = [
    path('flow/admin/', views.get_admin_flows, name='get_admin_flows'),
    path('flow/customer/', views.get_customer_flows, name='get_customer_flows'),
    path('flow/vendor/', views.get_vendor_flows, name='get_vendor_flows'),
    path('startflow/customer', views.create_flow_customer_vendor, name='Customer creates message flow to chat with vendor'),
    path('startflow/vendor', views.create_flow_vendor_admin, name='Vendor creates message flow to chat with admin'),
	#path('send/admin2vendor', views.create_flow_vendor_admin, name='create_flow_vendor_admin'),
	#path('send/admin2vendor', views.create_flow_vendor_admin, name='create_flow_vendor_admin'),

]
