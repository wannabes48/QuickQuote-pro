import React, { useEffect, useState } from 'react';
import api from '../api';
import { FileText, Plus, Download, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Quotes() {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-border overflow-hidden">
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
                                    <button className="text-gray-400 hover:text-primary mr-4 transition-colors"><Edit2 className="w-4 h-4" /></button>
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
        </div>
    );
}
