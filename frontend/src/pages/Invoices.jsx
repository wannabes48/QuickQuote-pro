import React, { useEffect, useState } from 'react';
import api from '../api';
import { Receipt, Download, CreditCard, X, MessageCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Invoices() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [upgradeMessage, setUpgradeMessage] = useState("");

    const handleWhatsApp = (invoice) => {
        if (!user || ['Free', 'Starter'].includes(user.subscription_tier)) {
            setUpgradeMessage("WhatsApp Delivery is a Professional tier feature. Upgrade to send invoices directly via WhatsApp!");
            setUpgradeModalOpen(true);
            return;
        }
        
        // Ensure you generate a reliable link (for MVP, let's assume public PDF endpoint or similar will exist)
        // Since invoices don't have public_token yet, we just generate a general message.
        const text = `Hi! Here is your invoice #${invoice.invoice_number} for ${invoice.currency} ${parseFloat(invoice.total).toLocaleString()}.`;
        const encodedText = encodeURIComponent(text);
        
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        addToast('Opening WhatsApp...', 'success');
    };

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

    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [activeInvoice, setActiveInvoice] = useState(null);
    const [phone, setPhone] = useState('');

    const openPaymentModal = (invoice) => {
        setActiveInvoice(invoice);
        setPhone('');
        setPaymentModalOpen(true);
    };

    const submitPayment = async () => {
        if (!phone) return;
        try {
            await api.post('payments/initiate/', { invoice_id: activeInvoice.id, phone_number: phone });
            addToast("M-Pesa payment prompt sent to the customer!", "success");
            setPaymentModalOpen(false);
            fetchInvoices();
        } catch (error) {
            addToast("Failed to initiate payment: " + (error.response?.data?.error || error.message), "error");
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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-border overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Invoice #</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Paid</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-border">
                        {invoices.map(invoice => (
                            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-dark whitespace-nowrap">{invoice.invoice_number}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                        invoice.status === 'Unpaid' ? 'bg-orange-100 text-orange-800' :
                                        'bg-blue-100 text-blue-800'
                                    }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{invoice.currency} {parseFloat(invoice.total).toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{invoice.currency} {parseFloat(invoice.amount_paid).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button onClick={() => downloadPDF(invoice.id, invoice.invoice_number)} className="text-gray-400 hover:text-primary mr-4 transition-colors" title="Download PDF"><Download className="w-4 h-4" /></button>
                                    <button onClick={() => handleWhatsApp(invoice)} className="text-gray-400 hover:text-green-500 mr-4 transition-colors" title="Send via WhatsApp"><MessageCircle className="w-4 h-4" /></button>
                                    {invoice.status !== 'Paid' && (
                                        <button onClick={() => openPaymentModal(invoice)} className="text-gray-400 hover:text-green-500 transition-colors" title="Request M-Pesa Payment"><CreditCard className="w-4 h-4" /></button>
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

            {paymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-dark">Initiate M-Pesa Payment</h2>
                            <button onClick={() => setPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">
                                Enter the customer's Safaricom phone number to push an STK prompt to their phone for invoice <strong>{activeInvoice?.invoice_number}</strong>.
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 254712345678" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={() => setPaymentModalOpen(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={submitPayment}
                                className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-md"
                            >
                                Send Prompt
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {upgradeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                <MessageCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-dark">Upgrade Required</h2>
                            <p className="text-gray-500 leading-relaxed">
                                {upgradeMessage}
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button 
                                type="button"
                                onClick={() => setUpgradeModalOpen(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="button"
                                onClick={() => navigate('/settings?tab=subscription')}
                                className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                            >
                                View Plans
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
