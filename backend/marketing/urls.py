from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_page, name='home'),
    path('features', views.features_page, name='features'),
    path('pricing', views.pricing_page, name='pricing'),
    path('robots.txt', views.robots_txt, name='robots_txt'),
]
