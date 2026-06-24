import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#374151',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a', // blue-900
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 10,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  titleBlock: {
    textAlign: 'right',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  quoteMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  metaLabel: {
    color: '#6b7280',
    width: 80,
    textAlign: 'right',
    marginRight: 8,
  },
  metaValue: {
    fontWeight: 'bold',
    width: 80,
    textAlign: 'right',
    color: '#111827',
  },
  clientSection: {
    marginBottom: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  clientHeading: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  clientDetails: {
    lineHeight: 1.4,
  },
  table: {
    width: 'auto',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 8,
  },
  colDesc: { width: '45%' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '20%', textAlign: 'right' },
  colTotal: { width: '20%', textAlign: 'right' },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  totalsBlock: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginTop: 4,
    borderTopWidth: 2,
    borderTopColor: '#1e3a8a',
  },
  totalLabel: {
    color: '#6b7280',
  },
  totalValue: {
    fontWeight: 'bold',
    color: '#111827',
  },
  finalTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  finalTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
  },
  notesHeading: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#6b7280',
  },
  signatureSection: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
    width: 250,
  },
  signatureImage: {
    height: 60,
    width: 'auto',
    marginBottom: 8,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#9ca3af',
  }
});

const formatCurrency = (amount, currency = 'KSh') => {
  if (amount === undefined || amount === null) return '';
  return `${currency} ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
};

export const QuotePDF = ({ data, businessProfile }) => {
  const {
    quote_number,
    issue_date,
    expiry_date,
    customer,
    items = [],
    subtotal = 0,
    discount = 0,
    vat = 0,
    total = 0,
    currency = 'KSh',
    notes = '',
    status,
    signature_data
  } = data || {};

  const bProfile = businessProfile || {};
  const cName = bProfile.company_name || 'QuickQuote Pro';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            {bProfile.company_logo ? (
              <Image style={styles.logo} src={bProfile.company_logo} />
            ) : (
              <Text style={styles.companyName}>{cName}</Text>
            )}
            <View style={styles.companyDetails}>
              {bProfile.company_address ? <Text>{bProfile.company_address}</Text> : null}
              {bProfile.company_email ? <Text>{bProfile.company_email}</Text> : null}
              {bProfile.tax_number ? <Text>Tax/PIN: {bProfile.tax_number}</Text> : null}
            </View>
          </View>
          
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Quotation</Text>
            <View style={styles.quoteMeta}>
              <Text style={styles.metaLabel}>Quote #:</Text>
              <Text style={styles.metaValue}>{quote_number || 'DRAFT'}</Text>
            </View>
            <View style={styles.quoteMeta}>
              <Text style={styles.metaLabel}>Date:</Text>
              <Text style={styles.metaValue}>{issue_date || new Date().toISOString().split('T')[0]}</Text>
            </View>
            <View style={styles.quoteMeta}>
              <Text style={styles.metaLabel}>Valid Until:</Text>
              <Text style={styles.metaValue}>{expiry_date || '-'}</Text>
            </View>
          </View>
        </View>

        {/* CLIENT DETAILS */}
        <View style={styles.clientSection}>
          <Text style={styles.clientHeading}>Quotation For:</Text>
          <Text style={styles.clientName}>{customer?.name || 'Customer Name'}</Text>
          <View style={styles.clientDetails}>
            {customer?.email ? <Text>{customer.email}</Text> : null}
            {customer?.phone ? <Text>{customer.phone}</Text> : null}
            {customer?.address ? <Text>{customer.address}</Text> : null}
          </View>
        </View>

        {/* ITEMS TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDesc]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Unit Price</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Amount</Text>
          </View>
          
          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description || 'Item description'}</Text>
              <Text style={styles.colQty}>{String(item.quantity || 1)}</Text>
              <Text style={styles.colPrice}>{formatCurrency(item.unit_price || 0, currency)}</Text>
              <Text style={styles.colTotal}>{formatCurrency((item.quantity || 1) * (item.unit_price || 0), currency)}</Text>
            </View>
          ))}
          {items.length === 0 ? (
            <View style={styles.tableRow}>
              <Text style={styles.colDesc}>No items added yet</Text>
            </View>
          ) : null}
        </View>

        {/* TOTALS */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsBlock}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>{formatCurrency(subtotal, currency)}</Text>
            </View>
            
            {Number(discount) > 0 ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount:</Text>
                <Text style={styles.totalValue}>-{formatCurrency(discount, currency)}</Text>
              </View>
            ) : null}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax (VAT):</Text>
              <Text style={styles.totalValue}>{formatCurrency(vat, currency)}</Text>
            </View>
            
            <View style={styles.totalRowFinal}>
              <Text style={styles.finalTotalLabel}>Total:</Text>
              <Text style={styles.finalTotalValue}>{formatCurrency(total, currency)}</Text>
            </View>
          </View>
        </View>

        {/* FOOTER & SIGNATURE */}
        <View style={styles.footer}>
          {notes ? (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.notesHeading}>Notes & Terms</Text>
              <Text style={styles.notesText}>{notes}</Text>
            </View>
          ) : null}
          
          {signature_data ? (
            <View style={styles.signatureSection}>
              <Image style={styles.signatureImage} src={signature_data} />
              <Text style={styles.signatureLabel}>Electronically Signed</Text>
            </View>
          ) : null}
        </View>

      </Page>
    </Document>
  );
};
