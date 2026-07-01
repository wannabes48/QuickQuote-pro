from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, ProfileView, SubscriptionUpgradeView, 
    PayHeroCallbackView, GoogleLoginView, RequestPasswordResetView, 
    ConfirmPasswordResetView, DashboardStatsView, CustomTokenObtainPairView,
    StripeWebhookView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/google/', GoogleLoginView.as_view(), name='google_login'),
    path('password-reset/', RequestPasswordResetView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', ConfirmPasswordResetView.as_view(), name='password_reset_confirm'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('subscription/upgrade/', SubscriptionUpgradeView.as_view(), name='subscription_upgrade'),
    path('subscription/callback/', PayHeroCallbackView.as_view(), name='subscription_callback'),
    path('subscription/webhook/stripe/', StripeWebhookView.as_view(), name='stripe-webhook'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
]
