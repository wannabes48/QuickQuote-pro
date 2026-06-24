import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { FileText, Users, DollarSign, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [recentQuotes, setRecentQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, quotesRes] = await Promise.all([
                    api.get('users/dashboard-stats/'),
                    api.get('quotes/')
                ]);
                
                setStats(statsRes.data);
                
                // Sort by ID descending (newest first)
                const sortedQuotes = quotesRes.data.sort((a, b) => b.id - a.id);
                setRecentQuotes(sortedQuotes.slice(0, 5));
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading dashboard...</p></div>;
    }

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monthly Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-border">
                    <h3 className="text-lg font-bold text-gray-dark mb-6">Monthly Revenue</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthly_revenue || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(value) => `${value >= 1000 ? (value/1000) + 'k' : value}`} />
                                <RechartsTooltip 
                                    cursor={{fill: '#F3F4F6'}} 
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                />
                                <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-border flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-bold text-gray-dark mb-2 w-full text-left">Quote Conversion Rate</h3>
                    <p className="text-sm text-gray-500 w-full text-left mb-8">Percentage of quotes approved</p>
                    
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="#F3F4F6" strokeWidth="16" fill="none" />
                            <circle cx="96" cy="96" r="88" stroke="#10B981" strokeWidth="16" fill="none" 
                                strokeDasharray={`${2 * Math.PI * 88}`}
                                strokeDashoffset={`${2 * Math.PI * 88 * (1 - (stats.conversion_rate / 100))}`}
                                className="transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-extrabold text-gray-dark">{stats.conversion_rate}%</span>
                        </div>
                    </div>
                    <p className="mt-8 text-gray-500 font-medium">Keep it up! Industry average is 35%.</p>
                </div>
            </div>

            {/* Overview Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-border flex items-center">
                    <div className="p-4 bg-blue-50 rounded-xl">
                        <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Quotes</p>
                        <h3 className="text-2xl font-bold text-gray-dark">{stats.total_quotes}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-border flex items-center">
                    <div className="p-4 bg-green-50 rounded-xl">
                        <FileText className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Approved Quotes</p>
                        <h3 className="text-2xl font-bold text-gray-dark">{stats.accepted_quotes}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-border flex items-center">
                    <div className="p-4 bg-orange-50 rounded-xl">
                        <FileText className="w-8 h-8 text-accent" />
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Pending Quotes</p>
                        <h3 className="text-2xl font-bold text-gray-dark">{stats.pending_quotes}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-border flex items-center">
                    <div className="p-4 bg-purple-50 rounded-xl">
                        <FileText className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Invoices Sent</p>
                        <h3 className="text-2xl font-bold text-gray-dark">{stats.invoices_sent}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-border flex items-center">
                    <div className="p-4 bg-emerald-50 rounded-xl">
                        <DollarSign className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-dark">
                            {user?.default_currency || 'KSh'} {stats.revenue.toLocaleString()}
                        </h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-border flex items-center">
                    <div className="p-4 bg-red-50 rounded-xl">
                        <DollarSign className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Outstanding</p>
                        <h3 className="text-2xl font-bold text-gray-dark">
                            {user?.default_currency || 'KSh'} {stats.outstanding_payments.toLocaleString()}
                        </h3>
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
