from rest_framework import permissions
from django.utils import timezone

class HasActiveSubscription(permissions.BasePermission):
    """
    Checks if the user has an active non-Free subscription.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        if request.user.subscription_end_date and request.user.subscription_end_date < timezone.now():
            return False
            
        return request.user.subscription_tier in ['Starter', 'Professional', 'Business']

class CanCreateQuote(permissions.BasePermission):
    """
    Free tier users can only create 5 quotes maximum.
    Premium tiers have unlimited.
    """
    message = "You have reached the maximum number of quotes (5) on the Free tier. Please upgrade to create more."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        if request.method in permissions.SAFE_METHODS:
            return True
            
        if request.method == 'POST':
            is_premium = False
            if request.user.subscription_tier != 'Free':
                if not request.user.subscription_end_date or request.user.subscription_end_date > timezone.now():
                    is_premium = True
            
            if is_premium:
                return True
                
            from quotes.models import Quote
            quote_count = Quote.objects.filter(customer__user=request.user).count()
            if quote_count >= 5:
                return False
                
        return True
