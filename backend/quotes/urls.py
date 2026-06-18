from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuoteViewSet
from .public_views import PublicQuoteView

router = DefaultRouter()
router.register(r'', QuoteViewSet, basename='quote')

urlpatterns = [
    path('public/<uuid:token>/', PublicQuoteView.as_view(), name='public-quote'),
    path('', include(router.urls)),
]
