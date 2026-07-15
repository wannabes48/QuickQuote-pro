from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_page, name='home'),
    path('features', views.features_page, name='features'),
    path('pricing', views.pricing_page, name='pricing'),
    path('robots.txt', views.robots_txt, name='robots_txt'),
    path('blog/', views.blog_index, name='blog_index'),
    path('blog/<slug:slug>/', views.blog_post, name='blog_post'),
    path('<slug:slug>', views.industry_page, name='industry'),
]
