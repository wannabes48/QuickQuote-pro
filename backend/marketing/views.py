from django.shortcuts import render

def landing_page(request):
    return render(request, 'marketing/index.html')

def features_page(request):
    return render(request, 'marketing/features.html')

def pricing_page(request):
    return render(request, 'marketing/pricing.html')

from django.http import HttpResponse

def robots_txt(request):
    lines = [
        "User-Agent: *",
        "Disallow: /admin/",
        "Disallow: /api/",
        "Sitemap: https://quickquotepro.online/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")
