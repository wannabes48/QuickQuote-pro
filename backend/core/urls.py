from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/customers/', include('customers.urls')),
    path('api/quotes/', include('quotes.urls')),
    path('api/invoices/', include('invoices.urls')),
    path('api/payments/', include('payments.urls')),
]
