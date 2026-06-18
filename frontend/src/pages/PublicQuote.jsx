import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import { Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AppLogo, AppLogoText } from '@/components/ui/logo';

export default function PublicQuote() {
    const { token } = useParams();
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [accepted, setAccepted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const sigCanvas = useRef({});

    useEffect(() => {
        // Fetch quote data using public token
        const fetchQuote = async () => {
            try {
                // Not using the authenticated 'api' instance
                const res = await axios.get(`http://localhost:8000/api/quotes/public/${token}/`);
                setQuote(res.data);
                if (res.data.status === 'Accepted') {
                    setAccepted(true);
                }
            } catch (err) {
                setError('Quote not found or invalid link.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuote();
    }, [token]);

    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    const handleAccept = async () => {
        try {
            if (sigCanvas.current.isEmpty()) {
                alert('Please provide your signature to accept the quote.');
                return;
            }

            setSubmitting(true);
            const signatureData = sigCanvas.current.getCanvas().toDataURL('image/png');

            await axios.post(`http://localhost:8000/api/quotes/public/${token}/`, {
                signature_data: signatureData
            });
            setAccepted(true);
            setQuote(prev => ({ ...prev, status: 'Accepted', signature_data: signatureData }));
        } catch (err) {
            console.error('Accept error:', err);
            alert('Failed to submit signature: ' + (err.response?.data?.error || err.message || 'Unknown error'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDownload = async () => {
        // The PDF endpoint currently requires auth. For public access, we would need a public PDF endpoint.
        // For the MVP, we will simulate or point to a public endpoint if we create one.
        alert('Downloading PDF...');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-pulse flex flex-col items-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-gray-500 font-medium">Loading your secure quote...</p></div></div>;
    
    if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md"><div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheck className="w-8 h-8" /></div><h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2><p className="text-gray-500">{error}</p></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center space-x-3 mb-8 sm:mb-4">
                        <AppLogo className="h-10 w-10" />
                        <AppLogoText className="text-2xl" showTagline />
                    </div>
                    <p className="mt-2 text-gray-500">Review your quotation and sign below to proceed.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 mb-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <p className="text-blue-200 font-medium text-sm tracking-wider uppercase mb-1">Quotation For</p>
                            <h2 className="text-3xl font-bold">{quote.customer_details?.name || 'Customer'}</h2>
                            <p className="text-blue-100 mt-1">{quote.customer_details?.phone}</p>
                        </div>
                        <div className="mt-6 md:mt-0 text-left md:text-right">
                            <p className="text-blue-200 font-medium text-sm tracking-wider uppercase mb-1">Quote Details</p>
                            <p className="text-xl font-semibold">#{quote.quote_number}</p>
                            <p className="text-blue-100 mt-1">Date: {new Date(quote.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-100">
                                        <th className="text-left py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                        <th className="text-center py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                                        <th className="text-right py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                        <th className="text-right py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {quote.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="py-4 text-gray-800 font-medium">{item.description}</td>
                                            <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                                            <td className="py-4 text-right text-gray-600">{quote.currency} {parseFloat(item.unit_price).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            <td className="py-4 text-right text-gray-900 font-semibold">{quote.currency} {parseFloat(item.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end border-t-2 border-gray-100 pt-8">
                            <div className="w-full md:w-1/2 mb-6 md:mb-0">
                                {quote.notes && (
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-2">Notes & Terms</h4>
                                        <p className="text-sm text-blue-800 whitespace-pre-line">{quote.notes}</p>
                                    </div>
                                )}
                            </div>
                            <div className="w-full md:w-72 space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">{quote.currency} {parseFloat(quote.subtotal).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>VAT (16%)</span>
                                    <span className="font-medium">{quote.currency} {parseFloat(quote.vat).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                </div>
                                <div className="flex justify-between items-center text-2xl font-bold text-gray-900 pt-4 border-t border-gray-200">
                                    <span>Total</span>
                                    <span className="text-blue-600">{quote.currency} {parseFloat(quote.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signature Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Accept Quotation</h3>
                    
                    {accepted ? (
                        <div className="bg-green-50 rounded-2xl p-6 border border-green-100 text-center">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h4 className="text-lg font-bold text-green-900 mb-1">Quotation Accepted</h4>
                            <p className="text-green-700 text-sm">Thank you for your business. We will proceed shortly.</p>
                            
                            {quote.signature_data && (
                                <div className="mt-6 border border-gray-200 rounded-xl p-4 bg-white inline-block">
                                    <p className="text-xs text-gray-500 font-medium mb-2 text-left uppercase tracking-wider">Digital Signature</p>
                                    <img src={quote.signature_data} alt="Client Signature" className="h-24 mx-auto" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="">
                            <p className="text-gray-500 text-sm mb-6">By signing below, you agree to the quoted terms and authorize us to proceed with the work.</p>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 mb-4 overflow-hidden touch-none relative">
                                <SignatureCanvas 
                                    ref={sigCanvas}
                                    penColor="#1e3a8a"
                                    canvasProps={{className: 'signature-canvas w-full h-48 cursor-crosshair'}}
                                />
                                <div className="absolute bottom-3 left-3 text-gray-400 text-xs font-medium uppercase tracking-wider pointer-events-none">Sign Here</div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                                <button onClick={clearSignature} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                    Clear Signature
                                </button>
                                <button 
                                    onClick={handleAccept} 
                                    disabled={submitting}
                                    className="w-full sm:w-auto px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center"
                                >
                                    {submitting ? 'Processing...' : 'Sign & Accept Quote'}
                                    {!submitting && <CheckCircle2 className="w-5 h-5 ml-2" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
