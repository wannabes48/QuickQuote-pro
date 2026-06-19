import React, { useEffect, useState } from 'react';
import api from '../api';
import { FileText, Plus, Download, Edit2, Trash2, Link as LinkIcon, FilePlus, MessageCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function Quotes() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [upgradeMessage, setUpgradeMessage] = useState("");

    const handleWhatsApp = (quote) => {
        if (!user || ['Free', 'Starter'].includes(user.subscription_tier)) {
            setUpgradeMessage("WhatsApp Delivery is a Professional tier feature. Upgrade to send quotes directly via WhatsApp!");
            setUpgradeModalOpen(true);
            return;
        }
        
        const publicLink = window.location.origin + '/quote/' + quote.public_token;
        const text = `Hi! Here is your quote #${quote.quote_number} for ${quote.currency} ${parseFloat(quote.total).toLocaleString()}. You can view and accept it securely here: ${publicLink}`;
        const encodedText = encodeURIComponent(text);
        
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        addToast('Opening WhatsApp...', 'success');
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const res = await api.get('quotes/');
            setQuotes(res.data.sort((a, b) => b.id - a.id));
        } catch (error) {
            console.error("Failed to fetch quotes", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async (id, quoteNumber) => {
        try {
            const response = await api.get(`quotes/${id}/pdf/`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Quote_${quoteNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Failed to download PDF", error);
        }
    };

    const convertToInvoice = async (id) => {
        try {
            await api.post(`quotes/${id}/convert_to_invoice/`);
            addToast("Quote successfully converted to invoice!", "success");
        } catch (error) {
            addToast("Failed to convert: " + (error.response?.data?.error || error.message), "error");
        }
    };

    if (loading) return <div className="p-8">Loading quotes...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-dark tracking-tight">Quotes</h1>
                    <p className="text-gray-500 mt-1">Manage your quotations</p>
                </div>
                <Link to="/quotes/new" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Quote
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-border overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quote #</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-border">
                        {quotes.map(quote => (
                            <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-dark">{quote.quote_number}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        quote.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                        quote.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                        quote.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                                        'bg-orange-100 text-orange-800'
                                    }`}>
                                        {quote.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{quote.currency} {parseFloat(quote.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                <td className="px-6 py-4 text-gray-500">{new Date(quote.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => downloadPDF(quote.id, quote.quote_number)} className="text-gray-400 hover:text-primary mr-4 transition-colors" title="Download PDF"><Download className="w-4 h-4" /></button>
                                    <button onClick={() => handleWhatsApp(quote)} className="text-gray-400 hover:text-green-500 mr-4 transition-colors" title="Send via WhatsApp"><MessageCircle className="w-4 h-4" /></button>
                                    <button onClick={() => { navigator.clipboard.writeText(window.location.origin + '/quote/' + quote.public_token); addToast('Public Link copied to clipboard!', 'success'); }} className="text-gray-400 hover:text-primary mr-4 transition-colors" title="Copy Public Link"><LinkIcon className="w-4 h-4" /></button>
                                    {quote.status === 'Accepted' && (
                                        <button onClick={() => convertToInvoice(quote.id)} className="text-gray-400 hover:text-green-500 mr-4 transition-colors" title="Convert to Invoice"><FilePlus className="w-4 h-4" /></button>
                                    )}
                                    <button className="text-gray-400 hover:text-danger transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                        {quotes.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                    <p className="text-lg font-medium text-gray-dark">No quotes created</p>
                                    <p className="mt-1">Create your first quote to get started.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
