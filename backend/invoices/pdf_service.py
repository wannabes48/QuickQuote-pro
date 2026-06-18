import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_invoice_pdf(invoice):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=18)
    
    elements = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=24, textColor=colors.HexColor('#10B981')) # Green for Invoice
    normal_style = styles['Normal']
    
    elements.append(Paragraph('QUICKQUOTE PRO', title_style))
    elements.append(Spacer(1, 12))
    
    elements.append(Paragraph(f"<b>INVOICE #{invoice.invoice_number}</b>", normal_style))
    elements.append(Paragraph(f"<b>Client:</b> {invoice.customer.name}", normal_style))
    elements.append(Paragraph(f"<b>Status:</b> {invoice.status}", normal_style))
    if invoice.due_date:
        elements.append(Paragraph(f"<b>Due Date:</b> {invoice.due_date}", normal_style))
    if invoice.notes:
        elements.append(Paragraph(f"<b>Notes:</b> {invoice.notes}", normal_style))
    elements.append(Spacer(1, 24))
    
    data = [['Description', 'Quantity', 'Unit Price', 'Total']]
    for item in invoice.items.all():
        data.append([
            item.description, 
            str(item.quantity), 
            f"{invoice.currency} {item.unit_price:,.2f}", 
            f"{invoice.currency} {item.total:,.2f}"
        ])
    
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
    
    amount_due = float(invoice.total) - float(invoice.amount_paid)
    
    totals_data = [
        ['', 'Subtotal:', f"{invoice.currency} {invoice.subtotal:,.2f}"],
        ['', 'VAT (16%):', f"{invoice.currency} {invoice.vat:,.2f}"],
        ['', 'Total:', f"{invoice.currency} {invoice.total:,.2f}"],
        ['', 'Amount Paid:', f"{invoice.currency} {invoice.amount_paid:,.2f}"],
        ['', 'Amount Due:', f"{invoice.currency} {amount_due:,.2f}"]
    ]
    
    tt = Table(totals_data, colWidths=[320, 100, 100])
    tt.setStyle(TableStyle([
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('FONTNAME', (1,-1), (-1,-1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (2,4), (2,4), colors.HexColor('#EF4444')), # Red for amount due
    ]))
    elements.append(tt)
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
