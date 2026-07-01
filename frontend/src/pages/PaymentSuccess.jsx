import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        // You could optionally verify the session_id here if needed
        // but the webhook handles the actual account upgrade securely.
    }, [sessionId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl text-center">
                <div>
                    <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Payment Successful!</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Thank you for your purchase. Your account has been upgraded successfully.
                    </p>
                </div>
                <div className="mt-8 space-y-4">
                    <Link to="/settings" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Return to Settings
                    </Link>
                    <Link to="/dashboard" className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
