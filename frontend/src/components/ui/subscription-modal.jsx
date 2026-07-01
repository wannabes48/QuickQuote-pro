import React, { useState } from 'react';
import { X, CreditCard, Smartphone } from 'lucide-react';
import api from '../../api';
import { useToast } from '../../context/ToastContext';

export function SubscriptionModal({ isOpen, onClose, tier }) {
    const { addToast } = useToast();
    const [phone, setPhone] = useState('');
    const [method, setMethod] = useState('mpesa'); // 'mpesa' or 'stripe'
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (method === 'mpesa' && !phone) return;
        
        setIsSubmitting(true);
        try {
            const response = await api.post('users/subscription/upgrade/', {
                tier: tier,
                method: method,
                phone_number: method === 'mpesa' ? phone : undefined
            });
            
            if (method === 'stripe') {
                window.location.href = response.data.checkout_url;
            } else {
                addToast("M-Pesa prompt sent! Please check your phone to complete the upgrade.", "success");
                onClose();
            }
        } catch (error) {
            addToast(error.response?.data?.error || "Failed to initiate payment.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-dark">Upgrade to {tier}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setMethod('mpesa')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === 'mpesa' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-300'}`}
                        >
                            <Smartphone className="w-8 h-8 mb-2" />
                            <span className="font-semibold text-sm">M-Pesa</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setMethod('stripe')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${method === 'stripe' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-300'}`}
                        >
                            <CreditCard className="w-8 h-8 mb-2" />
                            <span className="font-semibold text-sm">Card</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {method === 'mpesa' ? (
                            <>
                                <p className="text-sm text-gray-500">
                                    Enter your Safaricom phone number to receive an M-Pesa STK push. Once you enter your PIN, your account will be upgraded instantly.
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. 0712345678" 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">
                                You will be securely redirected to Stripe to complete your credit card payment. Your tier will be instantly upgraded upon success.
                            </p>
                        )}
                    </div>
                    
                    <div className="flex gap-4 pt-2">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 px-4 py-3 text-white font-semibold rounded-xl transition-colors shadow-md disabled:opacity-70 flex items-center justify-center ${method === 'mpesa' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                method === 'mpesa' ? "Pay with M-Pesa" : "Continue to Payment"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
