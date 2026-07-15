from django.shortcuts import render
from django.http import HttpResponse, Http404

def landing_page(request):
    return render(request, 'marketing/index.html')

def features_page(request):
    return render(request, 'marketing/features.html')

def pricing_page(request):
    return render(request, 'marketing/pricing.html')

def robots_txt(request):
    lines = [
        "User-Agent: *",
        "Disallow: /admin/",
        "Disallow: /api/",
        "Sitemap: https://quickquotepro.online/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")

INDUSTRIES = {
    'plumbers': {
        'name': 'Plumbers',
        'title': 'Plumbing Quote App & Quotation Software | QuickQuote Pro',
        'meta_description': 'Create professional plumbing quotations and invoices in minutes. Use our free plumbing quotation template to win more jobs.',
        'h1': 'Plumbing Quote App & Software',
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
        'title': 'Quote Software for Electricians & Estimate App | QuickQuote Pro',
        'meta_description': 'Generate professional electrical quotations and invoices in minutes using the best quote software for electricians.',
        'h1': 'Quote Software for Electricians',
        'h2_features': 'Features Built for Electrical Contractors',
        'benefits': [
            'Quickly itemize wiring, panels, and labor costs.',
            'Generate beautiful electrical estimate templates in excel or PDF.',
            'Convert approved electrical quotes into invoices instantly.'
        ],
        'icon': '⚡'
    },
    'contractors': {
        'name': 'Contractors',
        'title': 'Contractor Quotation Software & Estimating App | QuickQuote Pro',
        'meta_description': 'The best construction and contractor quotation software. Create professional contractor quotation templates quickly.',
        'h1': 'Contractor Quotation Software',
        'h2_features': 'Built for Construction & Building',
        'benefits': [
            'Manage large, multi-phase construction estimates effortlessly.',
            'Include materials, subcontractor costs, and equipment rentals.',
            'Send professional, branded contractor invoice templates in PDF format.'
        ],
        'icon': '🏗️'
    },
    'construction': {
        'name': 'Construction',
        'title': 'Construction Estimating Software & Quote App | QuickQuote Pro',
        'meta_description': 'Accurate construction estimating software for builders. Generate precise bids, proposals, and invoices in seconds.',
        'h1': 'Construction Estimating Software',
        'h2_features': 'Advanced Tools for Construction Bidding',
        'benefits': [
            'Break down complex projects into simple line items.',
            'Track client approvals and revisions in real-time.',
            'Convert construction estimates to professional invoices.'
        ],
        'icon': '🏢'
    },
    'hvac': {
        'name': 'HVAC',
        'title': 'HVAC Estimating Software & Quote App | QuickQuote Pro',
        'meta_description': 'Fast and accurate HVAC estimating software. Win more heating and cooling jobs with professional HVAC quote templates.',
        'h1': 'HVAC Estimating Software',
        'h2_features': 'Designed for Heating & Cooling Professionals',
        'benefits': [
            'Quote AC units, furnaces, ductwork, and labor instantly.',
            'Provide tiered good/better/best options to customers.',
            'Collect payments faster via integrated M-Pesa links.'
        ],
        'icon': '❄️'
    },
    'roofing': {
        'name': 'Roofing',
        'title': 'Roofing Estimate Software & Quotation App | QuickQuote Pro',
        'meta_description': 'Professional roofing estimate software. Generate beautiful roofing quotes and proposals right from the roof or the truck.',
        'h1': 'Roofing Estimate Software',
        'h2_features': 'Features Built for Roofers',
        'benefits': [
            'Calculate shingles, underlayment, and labor precisely.',
            'Attach photos of roof damage directly to your quotes.',
            'Get digital signatures and approvals instantly.'
        ],
        'icon': '🏠'
    },
    'painters': {
        'name': 'Painters',
        'title': 'Painting Quotation Software & Quote App | QuickQuote Pro',
        'meta_description': 'Create professional painting quotations and invoices. Use our painting quotation software to win more residential and commercial jobs.',
        'h1': 'Painting Quotation Software',
        'h2_features': 'Features Built for Painting Contractors',
        'benefits': [
            'Calculate paint, primer, and labor costs accurately.',
            'Provide detailed color choices and surface prep breakdowns.',
            'Track client approvals and sign-offs easily.'
        ],
        'icon': '🎨'
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


BLOG_POSTS = [
    {
        'slug': 'how-to-write-a-professional-quotation',
        'title': 'How to Write a Professional Quotation: A Step-by-Step Guide',
        'meta_description': 'Learn how to write a professional quotation that wins clients. We cover exactly what to include in your quotes to look professional and get paid faster.',
        'date': '2026-07-15',
        'author': 'QuickQuote Pro Team',
        'excerpt': 'A professional quotation is more than just a price tag; it’s a reflection of your business and the deciding factor for a client. Learn the essential elements to include.',
        'template': 'marketing/posts/how_to_write_quotation.html'
    },
    {
        'slug': 'quote-vs-estimate',
        'title': 'Quote vs Estimate: What is the Difference?',
        'meta_description': 'What is the difference between a quote and an estimate? Learn when to use an estimate versus a fixed quotation for your contracting business.',
        'date': '2026-07-10',
        'author': 'QuickQuote Pro Team',
        'excerpt': 'Contractors often use the terms "quote" and "estimate" interchangeably, but they mean very different things legally and practically. Find out which one you should be using.',
        'template': 'marketing/posts/quote_vs_estimate.html'
    },
    {
        'slug': 'how-much-should-contractors-charge',
        'title': 'How Much Should Contractors Charge? Pricing Strategies',
        'meta_description': 'Struggling with pricing? Discover how much contractors should charge, including hourly rates, fixed pricing, and how to calculate markup and margin.',
        'date': '2026-07-05',
        'author': 'QuickQuote Pro Team',
        'excerpt': 'Pricing your services correctly is the difference between a thriving business and struggling to make ends meet. Learn the best pricing strategies for contractors.',
        'template': 'marketing/posts/how_much_to_charge.html'
    },
    {
        'slug': 'free-quotation-template',
        'title': 'Free Quotation Template for Small Businesses (PDF & Excel)',
        'meta_description': 'Download our free professional quotation template for your business. Available in PDF and Excel, perfectly formatted to help you win more jobs.',
        'date': '2026-07-01',
        'author': 'QuickQuote Pro Team',
        'excerpt': 'Stop writing quotes by hand or using messy Word documents. Use our free, professionally designed quotation template to impress your clients today.',
        'template': 'marketing/posts/free_quotation_template.html'
    }
]

def blog_index(request):
    return render(request, 'marketing/blog_index.html', {'posts': BLOG_POSTS})

def blog_post(request, slug):
    post = next((p for p in BLOG_POSTS if p['slug'] == slug), None)
    if not post:
        raise Http404("Blog post not found")
    return render(request, 'marketing/blog_post.html', {'post': post})
