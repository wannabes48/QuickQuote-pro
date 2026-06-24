import io
from django.conf import settings
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import urllib.request

def generate_quote_pdf(quote):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=28, textColor=colors.HexColor('#1e3a8a'), alignment=2)
    meta_style = ParagraphStyle('Meta', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#6b7280'), alignment=2)
    meta_val_style = ParagraphStyle('MetaVal', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#111827'), alignment=2, fontName='Helvetica-Bold')
    h2_style = ParagraphStyle('H2', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#9ca3af'), textTransform='uppercase', fontName='Helvetica-Bold')
    normal_style = styles['Normal']
    normal_bold = ParagraphStyle('NormalBold', parent=styles['Normal'], fontName='Helvetica-Bold')
    
    company = quote.customer.user
    company_name = company.company_name if hasattr(company, 'company_name') and company.company_name else company.get_full_name() or 'QuickQuote Pro'
    
    # HEADER (Logo/Name Left, Title Right)
    header_data = []
    left_cell = []
    
    # Try to add logo
    logo_added = False
    if hasattr(company, 'company_logo') and company.company_logo:
        try:
            img_path = company.company_logo.path
            img = Image(img_path, width=120, height=40, kind='proportional')
            left_cell.append(img)
            logo_added = True
        except Exception:
            pass
            
    if not logo_added:
        left_cell.append(Paragraph(company_name, ParagraphStyle('CName', fontSize=24, textColor=colors.HexColor('#1e3a8a'), fontName='Helvetica-Bold')))
        
    if hasattr(company, 'company_address') and company.company_address:
        left_cell.append(Paragraph(company.company_address, normal_style))
    if hasattr(company, 'company_email') and company.company_email:
        left_cell.append(Paragraph(company.company_email, normal_style))
    if hasattr(company, 'tax_number') and company.tax_number:
        left_cell.append(Paragraph(f"Tax/PIN: {company.tax_number}", normal_style))

    right_cell = [
        Paragraph('QUOTATION', title_style),
        Spacer(1, 10),
        Paragraph(f"Quote #: <b>{quote.quote_number}</b>", meta_style),
        Paragraph(f"Date: <b>{quote.issue_date or quote.created_at.strftime('%Y-%m-%d')}</b>", meta_style),
        Paragraph(f"Valid Until: <b>{quote.expiry_date or '-'}</b>", meta_style)
    ]
    
    header_table = Table([[left_cell, right_cell]], colWidths=[260, 260])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 30))
    
    # CLIENT DETAILS
    elements.append(Paragraph("QUOTATION FOR:", h2_style))
    elements.append(Paragraph(quote.customer.name, ParagraphStyle('CName', fontSize=14, fontName='Helvetica-Bold', textColor=colors.HexColor('#111827'))))
    if quote.customer.email:
        elements.append(Paragraph(quote.customer.email, normal_style))
    if quote.customer.phone:
        elements.append(Paragraph(quote.customer.phone, normal_style))
    if quote.customer.address:
        elements.append(Paragraph(quote.customer.address, normal_style))
        
    elements.append(Spacer(1, 30))
    
    # TABLE
    data = [['Description', 'Qty', 'Unit Price', 'Amount']]
    for item in quote.items.all():
        data.append([
            Paragraph(item.description, normal_style), 
            str(item.quantity), 
            f"{quote.currency} {item.unit_price:,.2f}", 
            f"{quote.currency} {item.total:,.2f}"
        ])
    
    t = Table(data, colWidths=[260, 50, 105, 105])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.white),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#1e3a8a')),
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('ALIGN', (0,0), (0,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('LINEBELOW', (0,0), (-1,0), 2, colors.HexColor('#1e3a8a')),
        ('LINEBELOW', (0,1), (-1,-1), 1, colors.HexColor('#f3f4f6')),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('TOPPADDING', (0,1), (-1,-1), 8),
        ('BOTTOMPADDING', (0,1), (-1,-1), 8),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 20))
    
    # TOTALS
    totals_data = [
        ['', 'Subtotal:', f"{quote.currency} {quote.subtotal:,.2f}"],
    ]
    if hasattr(quote, 'discount') and quote.discount and quote.discount > 0:
        totals_data.append(['', 'Discount:', f"-{quote.currency} {quote.discount:,.2f}"])
        
    totals_data.append(['', 'Tax (VAT):', f"{quote.currency} {quote.vat:,.2f}"])
    totals_data.append(['', 'Total:', f"{quote.currency} {quote.total:,.2f}"])
    
    tt = Table(totals_data, colWidths=[260, 155, 105])
    
    tt_style = [
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('FONTNAME', (1,-1), (-1,-1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (1,0), (1,-2), colors.HexColor('#6b7280')),
        ('TEXTCOLOR', (2,-1), (2,-1), colors.HexColor('#1e3a8a')),
        ('TEXTCOLOR', (1,-1), (1,-1), colors.HexColor('#1e3a8a')),
        ('FONTSIZE', (1,-1), (2,-1), 12),
        ('TOPPADDING', (1,-1), (2,-1), 10),
        ('LINEABOVE', (1,-1), (2,-1), 2, colors.HexColor('#1e3a8a')),
    ]
    
    # Add green color to discount line if it exists
    if len(totals_data) == 4:
        tt_style.append(('TEXTCOLOR', (2,1), (2,1), colors.HexColor('#10B981')))
        
    tt.setStyle(TableStyle(tt_style))
    elements.append(tt)
    
    elements.append(Spacer(1, 40))
    
    # NOTES & SIGNATURE
    if quote.notes:
        elements.append(Paragraph("NOTES & TERMS", h2_style))
        elements.append(Paragraph(quote.notes, ParagraphStyle('Notes', parent=styles['Normal'], fontSize=9, textColor=colors.HexColor('#6b7280'))))
        elements.append(Spacer(1, 30))
        
    if quote.signature_data:
        try:
            # signature_data is a base64 data URI: data:image/png;base64,iVBOR...
            header, encoded = quote.signature_data.split(",", 1)
            import base64
            sig_data = base64.b64decode(encoded)
            sig_img = Image(io.BytesIO(sig_data), width=150, height=50, kind='proportional')
            elements.append(sig_img)
            elements.append(Paragraph("Electronically Signed", ParagraphStyle('Sig', parent=styles['Normal'], fontSize=9, textColor=colors.HexColor('#9ca3af'))))
        except Exception as e:
            pass
            
    doc.build(elements)
    buffer.seek(0)
    return buffer
