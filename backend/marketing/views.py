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

from django.http import Http404

INDUSTRIES = {
    'plumbers': {
        'name': 'Plumbers',
        'title': 'Plumbing Quotation Template & Software | QuickQuote Pro',
        'meta_description': 'Create professional plumbing quotations and invoices in minutes. Use our free plumbing quotation template to win more jobs.',
        'h1': 'Quotation Software for Plumbers',
        'h2_features': 'Features Built for Plumbing Businesses',
        'benefits': [
            'Create accurate plumbing estimates on-site.',
            'Include specific materials, labor costs, and fixtures easily.',
            'Send professional PDF quotes directly to clients via email or SMS.'
        ],
        'icon': '🚰'
    },
    'electricians': {
        'name': 'Electricians',
        'title': 'Electrician Estimate Template & Software | QuickQuote Pro',
        'meta_description': 'Generate professional electrical quotations and invoices in minutes using QuickQuote Pro.',
        'h1': 'Quotation Software for Electricians',
        'h2_features': 'Features Built for Electrical Contractors',
        'benefits': [
            'Quickly itemize wiring, panels, and labor costs.',
            'Generate beautiful electrical estimate templates in excel or PDF.',
            'Convert approved electrical quotes into invoices instantly.'
        ],
        'icon': '⚡'
    },
    'solar-installers': {
        'name': 'Solar Installers',
        'title': 'Solar Installation Quotation Software | QuickQuote Pro',
        'meta_description': 'Learn how to quote solar installation jobs professionally. Create solar estimates and invoices in minutes.',
        'h1': 'Quotation Software for Solar Installers',
        'h2_features': 'Built for Solar Energy Projects',
        'benefits': [
            'Easily quote solar panels, inverters, batteries, and installation labor.',
            'Provide clear ROI and cost breakdowns to your clients.',
            'Get paid faster with integrated M-Pesa payments.'
        ],
        'icon': '☀️'
    },
    'painters': {
        'name': 'Painters',
        'title': 'Painter Quote Template & Software | QuickQuote Pro',
        'meta_description': 'Create professional painting quotations and invoices. Use our painter quote template to win more residential and commercial jobs.',
        'h1': 'Quotation Software for Painters',
        'h2_features': 'Features Built for Painting Contractors',
        'benefits': [
            'Calculate paint, primer, and labor costs per square foot accurately.',
            'Provide detailed color choices and surface prep breakdowns.',
            'Track client approvals and sign-offs easily.'
        ],
        'icon': '🎨'
    },
    'building-contractors': {
        'name': 'Building Contractors',
        'title': 'Contractor Quotation Template Kenya | QuickQuote Pro',
        'meta_description': 'The best invoice software for fundis and building contractors in Kenya. Create professional contractor quotation templates.',
        'h1': 'Quotation Software for Building Contractors',
        'h2_features': 'Built for Construction & Building',
        'benefits': [
            'Manage large, multi-phase construction estimates effortlessly.',
            'Include materials, subcontractor costs, and equipment rentals.',
            'Send professional, branded contractor invoice templates in PDF format.'
        ],
        'icon': '🏗️'
    }
}

def industry_page(request, slug):
    if slug not in INDUSTRIES:
        raise Http404("Industry not found")
    
    context = {
        'industry': INDUSTRIES[slug],
        'slug': slug
    }
    return render(request, 'marketing/industry.html', context)
