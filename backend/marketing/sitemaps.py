from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .views import INDUSTRIES

class StaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = 'weekly'

    def items(self):
        return ['home', 'features', 'pricing']

    def location(self, item):
        return reverse(item)

class IndustrySitemap(Sitemap):
    priority = 0.9
    changefreq = 'monthly'

    def items(self):
        return list(INDUSTRIES.keys())

    def location(self, item):
        return reverse('industry', kwargs={'slug': item})
