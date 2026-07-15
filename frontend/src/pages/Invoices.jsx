import React, { useEffect, useState } from 'react';
import api from '../api';
import { Receipt, Download, CreditCard, X, MessageCircle, Smartphone, Link2, QrCode, Copy, Check, ExternalLink } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

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

    // Payment modal state
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [activeInvoice, setActiveInvoice] = useState(null);
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('stk');
    const [generatedLink, setGeneratedLink] = useState('');
    const [linkLoading, setLinkLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [stkLoading, setStkLoading] = useState(false);

    const openPaymentModal = (invoice) => {
        setActiveInvoice(invoice);
        setPhone('');
        setPaymentMethod('stk');
        setGeneratedLink('');
        setCopied(false);
        setLinkLoading(false);
        setStkLoading(false);
        setPaymentModalOpen(true);
    };

    const submitPayment = async () => {
        if (!phone) {
            addToast('Please enter a phone number', 'error');
            return;
        }
        setStkLoading(true);
        try {
            await api.post('payments/initiate/', { invoice_id: activeInvoice.id, phone_number: phone });
            addToast("M-Pesa payment prompt sent to the customer!", "success");
            setPaymentModalOpen(false);
            fetchInvoices();
        } catch (error) {
            addToast("Failed to initiate payment: " + (error.response?.data?.error || error.message), "error");
        } finally {
            setStkLoading(false);
        }
    };

    const generatePaymentLink = async () => {
        setLinkLoading(true);
        try {
            const res = await api.post('payments/generate_link/', { invoice_id: activeInvoice.id });
            setGeneratedLink(res.data.payment_link);
        } catch (error) {
            addToast('Failed to generate payment link: ' + (error.response?.data?.error || error.message), 'error');
        } finally {
            setLinkLoading(false);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        addToast('Payment link copied!', 'success');
    };

    const shareViaWhatsApp = () => {
        const text = `Hi! Please use this secure link to pay invoice #${activeInvoice.invoice_number}: ${generatedLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    // Auto-generate link when switching to QR tab
    useEffect(() => {
        if (paymentMethod === 'qr' && !generatedLink && activeInvoice && !linkLoading) {
            generatePaymentLink();
        }
    }, [paymentMethod]);

    const amountDue = activeInvoice ? parseFloat(activeInvoice.total) - parseFloat(activeInvoice.amount_paid) : 0;

    const paymentMethods = [
        { id: 'stk', label: 'M-Pesa STK', icon: Smartphone, desc: 'Send prompt to phone' },
        { id: 'link', label: 'Payment Link', icon: Link2, desc: 'Share a payment link' },
        { id: 'qr', label: 'QR Code', icon: QrCode, desc: 'Scan to pay' },
    ];

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
                                        <button onClick={() => openPaymentModal(invoice)} className="text-gray-400 hover:text-green-500 transition-colors" title="Collect Payment"><CreditCard className="w-4 h-4" /></button>
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

            {/* Payment Modal */}
            {paymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold">Collect Payment</h2>
                                    <p className="text-emerald-100 text-sm mt-1">Invoice #{activeInvoice?.invoice_number}</p>
                                </div>
                                <button onClick={() => setPaymentModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mt-3 bg-white/15 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                                <p className="text-emerald-100 text-xs font-medium">Amount Due</p>
                                <p className="text-2xl font-bold">{activeInvoice?.currency} {amountDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        {/* Payment Method Tabs */}
                        <div className="px-6 pt-5">
                            <div className="grid grid-cols-3 gap-2">
                                {paymentMethods.map(m => (
                                    <button
                                        key={m.id}
                                        onClick={() => setPaymentMethod(m.id)}
                                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                                            paymentMethod === m.id
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        <m.icon className="w-5 h-5" />
                                        <span className="text-xs font-semibold">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="px-6 py-5 min-h-[220px]">
                            {/* M-Pesa STK Push */}
                            {paymentMethod === 'stk' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <p className="text-sm text-gray-500">
                                        Send an M-Pesa payment prompt directly to the customer's Safaricom phone.
                                    </p>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 254712345678"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={submitPayment}
                                        disabled={stkLoading}
                                        className="w-full px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        {stkLoading ? (
                                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Sending...</>
                                        ) : (
                                            <><Smartphone className="w-4 h-4" /> Send M-Pesa Prompt</>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Payment Link */}
                            {paymentMethod === 'link' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <p className="text-sm text-gray-500">
                                        Generate a secure payment link to share with your customer via WhatsApp, SMS, or email.
                                    </p>
                                    {!generatedLink ? (
                                        <button
                                            onClick={generatePaymentLink}
                                            disabled={linkLoading}
                                            className="w-full px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
                                        >
                                            {linkLoading ? (
                                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Generating...</>
                                            ) : (
                                                <><Link2 className="w-4 h-4" /> Generate Payment Link</>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={generatedLink}
                                                    readOnly
                                                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 truncate"
                                                />
                                                <button
                                                    onClick={copyLink}
                                                    className={`p-2 rounded-lg border transition-all ${
                                                        copied
                                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                            : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                    }`}
                                                    title="Copy link"
                                                >
                                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                                <a
                                                    href={generatedLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg border bg-white border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all"
                                                    title="Open link"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                            <button
                                                onClick={shareViaWhatsApp}
                                                className="w-full px-4 py-2.5 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1da851] transition-colors shadow-md flex items-center justify-center gap-2"
                                            >
                                                <MessageCircle className="w-4 h-4" /> Send via WhatsApp
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* QR Code */}
                            {paymentMethod === 'qr' && (
                                <div className="space-y-4 animate-in fade-in">
                                    {linkLoading ? (
                                        <div className="flex flex-col items-center py-6">
                                            <span className="w-8 h-8 border-3 border-gray-200 border-t-emerald-500 rounded-full animate-spin mb-3"></span>
                                            <p className="text-sm text-gray-500">Generating QR code...</p>
                                        </div>
                                    ) : generatedLink ? (
                                        <div className="flex flex-col items-center">
                                            <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-sm">
                                                <QRCodeSVG
                                                    value={generatedLink}
                                                    size={180}
                                                    level="H"
                                                    includeMargin={true}
                                                    bgColor="#ffffff"
                                                    fgColor="#1f2937"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-3 text-center">
                                                Scan with M-Pesa app or any banking app to pay
                                            </p>
                                            <button
                                                onClick={copyLink}
                                                className="mt-3 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                                            >
                                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                {copied ? 'Copied!' : 'Copy payment link'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-6">
                                            <QrCode className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-sm text-gray-500 mb-3">Generate a QR code for this invoice</p>
                                            <button
                                                onClick={generatePaymentLink}
                                                className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
                                            >
                                                Generate QR Code
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Upgrade Modal (keep as-is) */}
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
