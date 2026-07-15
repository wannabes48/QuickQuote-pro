import React, { useEffect, useState } from 'react';
import api from '../api';
import { Receipt, Download, CreditCard, X, MessageCircle, Smartphone, Link2, QrCode, Copy, Check, ExternalLink, History } from 'lucide-react';
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

    // Detail Drawer state
    const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Record Payment Modal state
    const [recordModalOpen, setRecordModalOpen] = useState(false);
    
    // M-Pesa / Link Collection state
    const [collectModalOpen, setCollectModalOpen] = useState(false);
    const [activeInvoice, setActiveInvoice] = useState(null);
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('stk');
    const [generatedLink, setGeneratedLink] = useState('');
    const [linkLoading, setLinkLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [stkLoading, setStkLoading] = useState(false);

    const openDetailDrawer = async (invoice) => {
        setActiveInvoice(invoice);
        setDetailDrawerOpen(true);
        setHistoryLoading(true);
        try {
            const res = await api.get(`payments/?invoice_id=${invoice.id}`);
            setPaymentHistory(res.data.sort((a, b) => b.id - a.id));
        } catch (e) {
            console.error(e);
        } finally {
            setHistoryLoading(false);
        }
    };

    const openCollectModal = (invoice, e) => {
        if(e) e.stopPropagation();
        setActiveInvoice(invoice);
        setPhone('');
        setPaymentMethod('stk');
        setGeneratedLink('');
        setCopied(false);
        setLinkLoading(false);
        setStkLoading(false);
        setCollectModalOpen(true);
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
            setCollectModalOpen(false);
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

    // Manual Record Form State
    const [recordAmount, setRecordAmount] = useState('');
    const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);
    const [recordMethod, setRecordMethod] = useState('Cash');
    const [recordRef, setRecordRef] = useState('');
    const [recordType, setRecordType] = useState('Full Payment');
    const [recordNotes, setRecordNotes] = useState('');
    const [recordLoading, setRecordLoading] = useState(false);

    const openRecordModal = () => {
        setRecordAmount(amountDue > 0 ? amountDue.toString() : '');
        setRecordDate(new Date().toISOString().split('T')[0]);
        setRecordMethod('Cash');
        setRecordRef('');
        setRecordType(amountDue === parseFloat(activeInvoice.total) ? 'Full Payment' : 'Final Payment');
        setRecordNotes('');
        setRecordModalOpen(true);
    };

    const submitRecordPayment = async (e) => {
        e.preventDefault();
        if (parseFloat(recordAmount) > amountDue) {
            addToast(`Payment exceeds outstanding balance of KSh ${amountDue.toLocaleString()}`, 'error');
            return;
        }
        setRecordLoading(true);
        try {
            await api.post('payments/record/', {
                invoice_id: activeInvoice.id,
                amount: recordAmount,
                payment_date: recordDate,
                method: recordMethod,
                reference_number: recordRef,
                deposit_type: recordType,
                notes: recordNotes
            });
            addToast('Payment recorded successfully!', 'success');
            setRecordModalOpen(false);
            fetchInvoices();
            openDetailDrawer(activeInvoice); // Refresh drawer
        } catch (error) {
            addToast('Failed to record payment: ' + (error.response?.data?.error || error.message), 'error');
        } finally {
            setRecordLoading(false);
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
                            <tr key={invoice.id} onClick={() => openDetailDrawer(invoice)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                <td className="px-6 py-4 font-medium text-gray-dark whitespace-nowrap">{invoice.invoice_number}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                        invoice.status === 'Unpaid' ? 'bg-orange-100 text-orange-800' :
                                        invoice.status === 'Partially Paid' ? 'bg-blue-100 text-blue-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{invoice.currency} {parseFloat(invoice.total).toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{invoice.currency} {parseFloat(invoice.amount_paid).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button onClick={(e) => { e.stopPropagation(); downloadPDF(invoice.id, invoice.invoice_number); }} className="text-gray-400 hover:text-primary mr-4 transition-colors" title="Download PDF"><Download className="w-4 h-4" /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleWhatsApp(invoice); }} className="text-gray-400 hover:text-green-500 mr-4 transition-colors" title="Send via WhatsApp"><MessageCircle className="w-4 h-4" /></button>
                                    {invoice.status !== 'Paid' && (
                                        <button onClick={(e) => openCollectModal(invoice, e)} className="text-gray-400 hover:text-green-500 transition-colors" title="Collect Payment via Link/M-Pesa"><Smartphone className="w-4 h-4" /></button>
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

            {/* Collect via M-Pesa / Link Modal */}
            {collectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold">Collect Payment Online</h2>
                                    <p className="text-emerald-100 text-sm mt-1">Invoice #{activeInvoice?.invoice_number}</p>
                                </div>
                                <button onClick={() => setCollectModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
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

            {/* Invoice Detail Drawer */}
            {detailDrawerOpen && activeInvoice && (
                <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setDetailDrawerOpen(false)}>
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Invoice #{activeInvoice.invoice_number}</h2>
                                <p className="text-sm text-gray-500 mt-1">Status: <span className="font-semibold text-gray-700">{activeInvoice.status}</span></p>
                            </div>
                            <button onClick={() => setDetailDrawerOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50">
                            
                            {/* Summary */}
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                                <p className="text-sm font-medium text-gray-500 mb-1">Outstanding Balance</p>
                                <h3 className="text-4xl font-bold text-gray-900 mb-6">{activeInvoice.currency} {amountDue.toLocaleString()}</h3>
                                <div className="grid grid-cols-2 gap-3 mb-6 border-t border-gray-50 pt-5">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Total</p>
                                        <p className="text-sm font-semibold text-gray-800">{activeInvoice.currency} {parseFloat(activeInvoice.total).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Paid</p>
                                        <p className="text-sm font-semibold text-green-600">{activeInvoice.currency} {parseFloat(activeInvoice.amount_paid).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <button 
                                        onClick={openRecordModal}
                                        disabled={amountDue <= 0}
                                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {amountDue <= 0 ? 'Fully Paid' : 'Receive Payment'}
                                    </button>
                                    <button 
                                        onClick={() => openCollectModal(activeInvoice)}
                                        disabled={amountDue <= 0}
                                        className="w-full py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-semibold shadow-sm hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Smartphone className="w-4 h-4" /> Collect Online (M-Pesa)
                                    </button>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                                    <History className="w-4 h-4 text-gray-400" /> Payment History
                                </h3>
                                
                                {historyLoading ? (
                                    <div className="text-center py-8 text-gray-400 text-sm">Loading history...</div>
                                ) : paymentHistory.length === 0 ? (
                                    <div className="text-center py-8 bg-white border border-dashed border-gray-200 rounded-2xl">
                                        <p className="text-sm text-gray-500">No payments recorded yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {paymentHistory.map((payment, idx) => (
                                            <div key={payment.id} className="relative flex gap-4">
                                                {/* Line */}
                                                {idx !== paymentHistory.length - 1 && (
                                                    <div className="absolute left-6 top-10 bottom-[-24px] w-0.5 bg-gray-200"></div>
                                                )}
                                                
                                                {/* Icon */}
                                                <div className="w-12 h-12 flex-shrink-0 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center z-10 shadow-sm text-blue-600">
                                                    <Check className="w-5 h-5" />
                                                </div>
                                                
                                                {/* Content */}
                                                <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-semibold text-gray-900">{payment.method}</span>
                                                        <span className="font-bold text-gray-900">{activeInvoice.currency} {parseFloat(payment.amount).toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                                        <span>{new Date(payment.payment_date || payment.created_at).toLocaleDateString()}</span>
                                                        {payment.deposit_type && (
                                                            <>
                                                                <span>&bull;</span>
                                                                <span className="text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded-md">{payment.deposit_type}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {(payment.reference_number || payment.transaction_id) && (
                                                        <p className="text-xs text-gray-400 mt-2 font-mono bg-gray-50 p-1.5 rounded inline-block">
                                                            Ref: {payment.reference_number || payment.transaction_id}
                                                        </p>
                                                    )}
                                                    {payment.notes && (
                                                        <p className="text-sm text-gray-600 mt-2 bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                                                            {payment.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Record Payment Modal */}
            {recordModalOpen && activeInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
                            <button onClick={() => setRecordModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="record-payment-form" onSubmit={submitRecordPayment} className="space-y-8">
                                
                                {/* Section 1: Summary (Read-only) */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Invoice Summary</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <p className="text-xs font-medium text-gray-500 mb-1">Invoice Total</p>
                                            <p className="text-lg font-bold text-gray-900">{activeInvoice.currency} {parseFloat(activeInvoice.total).toLocaleString()}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                            <p className="text-xs font-medium text-green-600 mb-1">Already Paid</p>
                                            <p className="text-lg font-bold text-green-700">{activeInvoice.currency} {parseFloat(activeInvoice.amount_paid).toLocaleString()}</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-inner">
                                            <p className="text-xs font-medium text-blue-600 mb-1">Outstanding</p>
                                            <p className="text-lg font-bold text-blue-700">{activeInvoice.currency} {amountDue.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Details */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Payment Details</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">{activeInvoice.currency}</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    required
                                                    max={amountDue}
                                                    value={recordAmount}
                                                    onChange={(e) => setRecordAmount(e.target.value)}
                                                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow text-lg font-semibold"
                                                />
                                            </div>
                                            {parseFloat(recordAmount) > amountDue && (
                                                <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                                                    ⚠️ Payment exceeds outstanding balance.
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                                            <input
                                                type="date"
                                                required
                                                value={recordDate}
                                                onChange={(e) => setRecordDate(e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                            <select
                                                value={recordMethod}
                                                onChange={(e) => setRecordMethod(e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
                                            >
                                                <option>Cash</option>
                                                <option>Bank Transfer</option>
                                                <option>M-Pesa STK</option>
                                                <option>Credit Card</option>
                                                <option>Cheque</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                                            <input
                                                type="text"
                                                placeholder={recordMethod === 'M-Pesa STK' ? 'e.g. QHG7J4KLMN' : 'e.g. TRX-009384'}
                                                value={recordRef}
                                                onChange={(e) => setRecordRef(e.target.value)}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Type</label>
                                        <div className="flex flex-wrap gap-3">
                                            {['Deposit', 'Partial Payment', 'Final Payment', 'Full Payment'].map(type => (
                                                <label key={type} className={`cursor-pointer flex items-center px-4 py-2 border rounded-full text-sm font-medium transition-colors ${recordType === type ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                                                    <input 
                                                        type="radio" 
                                                        name="depositType" 
                                                        value={type}
                                                        checked={recordType === type}
                                                        onChange={(e) => setRecordType(e.target.value)}
                                                        className="hidden" 
                                                    />
                                                    {type}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <textarea
                                            placeholder="Optional notes e.g. 'Customer paid on site.'"
                                            rows="2"
                                            value={recordNotes}
                                            onChange={(e) => setRecordNotes(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => setRecordModalOpen(false)}
                                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                form="record-payment-form"
                                disabled={recordLoading || parseFloat(recordAmount) > amountDue}
                                className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {recordLoading ? (
                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Saving...</>
                                ) : (
                                    'Save Payment'
                                )}
                            </button>
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
