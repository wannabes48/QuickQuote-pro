from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, MpesaCallbackView, PayHeroCallbackView

router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    path('callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
    path('payhero-callback/', PayHeroCallbackView.as_view(), name='payhero-callback'),
    path('', include(router.urls)),
]
