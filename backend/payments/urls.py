from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, MpesaCallbackView

router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    path('callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
    path('', include(router.urls)),
]
