from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView, SubscriptionUpgradeView, PayHeroCallbackView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('subscription/upgrade/', SubscriptionUpgradeView.as_view(), name='subscription_upgrade'),
    path('subscription/callback/', PayHeroCallbackView.as_view(), name='subscription_callback'),
]
