import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_quote_pdf(quote):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=18)
    
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=24, textColor=colors.HexColor('#2563EB'))
    normal_style = styles['Normal']
    
    # Header
    elements.append(Paragraph('QUICKQUOTE PRO', title_style))
    elements.append(Spacer(1, 12))
    
    # Quote Details
    elements.append(Paragraph(f"<b>Quote #{quote.quote_number}</b>", normal_style))
    elements.append(Paragraph(f"<b>Client:</b> {quote.customer.name}", normal_style))
    if quote.notes:
        elements.append(Paragraph(f"<b>Notes:</b> {quote.notes}", normal_style))
    elements.append(Spacer(1, 24))
    
    # Table Data
    data = [['Description', 'Quantity', 'Unit Price', 'Total']]
    for item in quote.items.all():
        data.append([
            item.description, 
            str(item.quantity), 
            f"{quote.currency} {item.unit_price:,.2f}", 
            f"{quote.currency} {item.total:,.2f}"
        ])
    
    # Table Style
    t = Table(data, colWidths=[250, 70, 100, 100])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F9FAFB')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#1F2937')),
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('ALIGN', (0,0), (0,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,0), 12),
        ('BACKGROUND', (0,1), (-1,-1), colors.white),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#E5E7EB')),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 24))
    
    # Totals
    totals_data = [
        ['', 'Subtotal:', f"{quote.currency} {quote.subtotal:,.2f}"],
        ['', 'VAT (16%):', f"{quote.currency} {quote.vat:,.2f}"],
        ['', 'Total:', f"{quote.currency} {quote.total:,.2f}"]
    ]
    
    tt = Table(totals_data, colWidths=[320, 100, 100])
    tt.setStyle(TableStyle([
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('FONTNAME', (1,-1), (-1,-1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (2,-1), (2,-1), colors.HexColor('#10B981')),
    ]))
    elements.append(tt)
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
