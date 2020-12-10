from django.urls import path

from . import views

urlpatterns = [
    path('flow/admin/', views.get_admin_flows, name='get_admin_flows'),
    path('flow/customer/', views.get_customer_flows, name='get_customer_flows'),
    path('flow/vendor/', views.get_vendor_flows, name='get_vendor_flows'),
    path('startflow/customer/', views.create_flow_customer_vendor, name='Customer creates message flow to chat with vendor'),
    path('startflow/vendor/', views.create_flow_vendor_admin, name='Vendor creates message flow to chat with admin'),
    path('send/admin/tovendor/', views.admin_message_to_vendor, name='admin_message_to_vendor'),
    path('send/customer/tovendor/', views.customer_message_to_vendor, name='customer_message_to_vendor'),
    path('send/vendor/tocustomer/', views.vendor_message_to_customer, name='vendor_message_to_customer'),
    path('send/vendor/toadmin/', views.vendor_message_to_admin, name='vendor_message_to_admin'),
    path('chat/ofcustomer/', views.get_messages_from_flow_customer, name='get_messages_from_flow_customer'),
    path('chat/ofvendor/wadmin/', views.get_messages_from_admin_flow_vendor, name='get_messages_from_admin_flow_vendor'),
    path('chat/ofvendor/wcustomer/', views.get_messages_from_customer_flow_vendor, name='get_messages_from_customer_flow_vendor'),
    path('chat/ofadmin/', views.get_messages_from_flow_admin, name='get_messages_from_flow_admin'),

]
