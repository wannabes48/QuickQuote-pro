import React, { useEffect, useState } from 'react';
import api from '../api';
import { Receipt, Download, CreditCard } from 'lucide-react';

export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.get('invoices/');
            setInvoices(res.data.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async (id, invoiceNumber) => {
        try {
            const response = await api.get(`invoices/${id}/pdf/`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${invoiceNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Failed to download PDF", error);
        }
    };

    const initiatePayment = async (id, total, amountPaid) => {
        const phone = prompt("Enter customer M-Pesa phone number (e.g. 254712345678):");
        if (!phone) return;
        
        try {
            await api.post('payments/initiate/', { invoice_id: id, phone_number: phone });
            alert("M-Pesa payment prompt sent to the customer!");
            fetchInvoices();
        } catch (error) {
            alert("Failed to initiate payment: " + (error.response?.data?.error || error.message));
        }
    };

    if (loading) return <div className="p-8">Loading invoices...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-dark tracking-tight">Invoices</h1>
                    <p className="text-gray-500 mt-1">Manage billing and payments</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice #</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-border">
                        {invoices.map(invoice => (
                            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-dark">{invoice.invoice_number}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                        invoice.status === 'Unpaid' ? 'bg-orange-100 text-orange-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{invoice.currency} {parseFloat(invoice.total).toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-500">{invoice.currency} {parseFloat(invoice.amount_paid).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => downloadPDF(invoice.id, invoice.invoice_number)} className="text-gray-400 hover:text-primary mr-4 transition-colors" title="Download PDF"><Download className="w-4 h-4" /></button>
                                    {invoice.status !== 'Paid' && (
                                        <button onClick={() => initiatePayment(invoice.id, invoice.total, invoice.amount_paid)} className="text-gray-400 hover:text-green-500 transition-colors" title="Request M-Pesa Payment"><CreditCard className="w-4 h-4" /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {invoices.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    <Receipt className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                    <p className="text-lg font-medium text-gray-dark">No invoices created</p>
                                    <p className="mt-1">Convert accepted quotes to invoices.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
