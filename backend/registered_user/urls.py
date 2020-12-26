from django.urls import path

from . import views

urlpatterns = [
    path('login', views.login, name='login'),
    path('login/google', views.google_login, name='google_login'),
    path('signup', views.signup, name='signup'),
    path('edit_profile', views.edit_profile, name='edit_profile')
]