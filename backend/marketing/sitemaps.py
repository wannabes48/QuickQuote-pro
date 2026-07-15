from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .views import INDUSTRIES, BLOG_POSTS

class StaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = 'weekly'

    def items(self):
        return ['home', 'features', 'pricing', 'blog_index']

    def location(self, item):
        return reverse(item)

class IndustrySitemap(Sitemap):
    priority = 0.9
    changefreq = 'monthly'

    def items(self):
        return list(INDUSTRIES.keys())

    def location(self, item):
        return reverse('industry', kwargs={'slug': item})

class BlogSitemap(Sitemap):
    priority = 0.7
    changefreq = 'monthly'

    def items(self):
        return [post['slug'] for post in BLOG_POSTS]

    def location(self, item):
        return reverse('blog_post', kwargs={'slug': item})
