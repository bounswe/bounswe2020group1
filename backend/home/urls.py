from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('recommendation/recommendation_pack', views.recommendation_pack, name='recommendation_pack'),
    path('recommendation/newest', views.newest_arrival, name='newest_arrival'),
    path('recommendation/bestseller', views.bestseller, name='bestseller'),
    path('recommendation/toprated', views.top_rated, name='top_rated'),
    path('recommendation/recommended', views.recommended_products, name='recommended_products'),
]
