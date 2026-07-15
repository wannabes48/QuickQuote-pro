from django.contrib import admin
from django.urls import path, include
from django.contrib.sitemaps.views import sitemap
from marketing.sitemaps import StaticViewSitemap, IndustrySitemap, BlogSitemap
from core.views import keep_alive

sitemaps = {
    'static': StaticViewSitemap,
    'industry': IndustrySitemap,
    'blog': BlogSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/customers/', include('customers.urls')),
    path('api/quotes/', include('quotes.urls')),
    path('api/invoices/', include('invoices.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/health/keep-alive/', keep_alive, name='keep-alive'),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('', include('marketing.urls')),
]
