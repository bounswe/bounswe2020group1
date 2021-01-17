from django.urls import path

from . import views

urlpatterns = [
    path('login', views.login, name='login'),
    path('login/google', views.google_login, name='google_login'),
    path('signup', views.signup, name='signup'),
    path('signup/google', views.google_signup, name='google_signup'),
    path('edit_profile', views.edit_profile, name='edit_profile'),
    path('resend_verification_code', views.resend_verification_code, name='resend_verification_code')
]