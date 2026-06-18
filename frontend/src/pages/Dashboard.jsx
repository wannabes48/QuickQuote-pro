import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { FileText, Users, DollarSign, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ quotesCount: 0, customersCount: 0, totalRevenue: 0 });
    const [recentQuotes, setRecentQuotes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [quotesRes, customersRes] = await Promise.all([
                    api.get('quotes/'),
                    api.get('customers/')
                ]);
                
                const quotes = quotesRes.data;
                const customers = customersRes.data;
                
                const revenue = quotes
                    .filter(q => q.status === 'Accepted')
                    .reduce((sum, q) => sum + parseFloat(q.total), 0);
                
                setStats({
                    quotesCount: quotes.length,
                    customersCount: customers.length,
                    totalRevenue: revenue
                });
                
                // Sort by ID descending (newest first)
                const sortedQuotes = quotes.sort((a, b) => b.id - a.id);
                setRecentQuotes(sortedQuotes.slice(0, 5));
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-dark tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user?.company_name || user?.username}!</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link to="/quotes/new" className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <Plus className="w-5 h-5 mr-2" />
                        Create Quote
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-border flex items-center">
                    <div className="p-4 bg-blue-50 rounded-xl">
                        <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Quotes</p>
                        <h3 className="text-2xl font-bold text-gray-dark">{stats.quotesCount}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-border flex items-center">
                    <div className="p-4 bg-green-50 rounded-xl">
                        <Users className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Customers</p>
                        <h3 className="text-2xl font-bold text-gray-dark">{stats.customersCount}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-border flex items-center">
                    <div className="p-4 bg-orange-50 rounded-xl">
                        <DollarSign className="w-8 h-8 text-accent" />
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Accepted Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-dark">KSh {stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-border overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-border flex justify-between items-center">
                    <h3 className="font-bold text-gray-dark text-lg">Recent Quotes</h3>
                    <Link to="/quotes" className="text-sm font-medium text-primary hover:text-blue-700">View all</Link>
                </div>
                {recentQuotes.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-border">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote Number</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-border">
                                {recentQuotes.map((quote) => (
                                    <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-dark">{quote.quote_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                quote.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                quote.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                                                quote.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                                                'bg-orange-100 text-orange-800'
                                            }`}>
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.currency} {parseFloat(quote.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(quote.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p>No quotes created yet.</p>
                        <Link to="/quotes/new" className="mt-4 inline-block text-primary font-medium hover:underline">Create your first quote</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
