from django.contrib import admin
from django.urls import path, include
from django.contrib.sitemaps.views import sitemap
from marketing.sitemaps import StaticViewSitemap

sitemaps = {
    'static': StaticViewSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/customers/', include('customers.urls')),
    path('api/quotes/', include('quotes.urls')),
    path('api/invoices/', include('invoices.urls')),
    path('api/payments/', include('payments.urls')),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('', include('marketing.urls')),
]
