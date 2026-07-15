import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  DollarSign, TrendingUp, TrendingDown, CreditCard, 
  FileText, Activity, Award, Lightbulb
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label, prefix = 'KSh ' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-lg font-bold text-gray-900">
          {prefix === 'KSh ' ? `KSh ${payload[0].value.toLocaleString()}` : `${payload[0].value}%`}
        </p>
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsRes, invoicesRes, quotesRes] = await Promise.all([
          api.get('payments/'),
          api.get('invoices/'),
          api.get('quotes/')
        ]);
        setPayments(paymentsRes.data);
        setInvoices(invoicesRes.data);
        setQuotes(quotesRes.data);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]"><span className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></span></div>;

  // 1. Overview metrics
  const totalRevenue = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const outstandingAmount = invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + (parseFloat(i.total) - parseFloat(i.amount_paid)), 0);
  
  const totalQuotes = quotes.length;
  const acceptedQuotes = quotes.filter(q => q.status === 'Accepted').length;
  const rejectedQuotes = quotes.filter(q => q.status === 'Rejected').length;
  const conversionRate = totalQuotes > 0 ? ((acceptedQuotes / totalQuotes) * 100).toFixed(1) : 0;

  // 2. Revenue Chart (Monthly)
  const monthlyRevenue = {};
  payments.filter(p => p.status === 'Completed').forEach(p => {
    const date = new Date(p.created_at);
    const month = date.toLocaleString('default', { month: 'short' });
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + parseFloat(p.amount);
  });
  const revenueData = Object.keys(monthlyRevenue).map(month => ({ name: month, revenue: monthlyRevenue[month] }));

  // 3. Invoice Aging
  let current = 0, thirty = 0, sixty = 0, ninety = 0, ninetyPlus = 0;
  invoices.filter(i => i.status !== 'Paid').forEach(inv => {
    const due = inv.due_date ? new Date(inv.due_date) : new Date();
    const diffDays = Math.ceil((new Date() - due) / (1000 * 60 * 60 * 24));
    const amt = parseFloat(inv.total) - parseFloat(inv.amount_paid);
    if (diffDays <= 0) current += amt;
    else if (diffDays <= 30) thirty += amt;
    else if (diffDays <= 60) sixty += amt;
    else if (diffDays <= 90) ninety += amt;
    else ninetyPlus += amt;
  });
  const agingData = [
    { name: 'Current', amount: current },
    { name: '1-30 Days', amount: thirty },
    { name: '31-60 Days', amount: sixty },
    { name: '61-90 Days', amount: ninety },
    { name: '90+ Days', amount: ninetyPlus },
  ];

  // 4. Payment Methods
  const methodCounts = {};
  payments.forEach(p => {
    const method = p.method || 'Unknown';
    methodCounts[method] = (methodCounts[method] || 0) + 1;
  });
  const paymentMethodData = Object.keys(methodCounts).map(m => ({ name: m, value: methodCounts[m] }));

  // 5. Top Customers
  const customerRevenue = {};
  payments.filter(p => p.status === 'Completed').forEach(p => {
    const customer = p.customer_name || 'Unknown';
    if (!customerRevenue[customer]) customerRevenue[customer] = { revenue: 0, invoices: new Set() };
    customerRevenue[customer].revenue += parseFloat(p.amount);
    customerRevenue[customer].invoices.add(p.invoice);
  });
  const topCustomers = Object.keys(customerRevenue)
    .map((name, idx) => ({
      id: idx,
      name,
      revenue: `KSh ${customerRevenue[name].revenue.toLocaleString()}`,
      rawRev: customerRevenue[name].revenue,
      invoices: customerRevenue[name].invoices.size
    }))
    .sort((a, b) => b.rawRev - a.rawRev)
    .slice(0, 4);

  const insights = [
    `You have generated KSh ${totalRevenue.toLocaleString()} in total revenue.`,
    `There is KSh ${outstandingAmount.toLocaleString()} currently outstanding across unpaid invoices.`,
    `Your quote conversion rate is ${conversionRate}% (${acceptedQuotes} accepted out of ${totalQuotes}).`,
    topCustomers.length > 0 ? `${topCustomers[0].name} is your top customer, generating ${topCustomers[0].revenue}.` : "No completed payments yet."
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Detailed overview of your business performance and metrics.</p>
        </div>
        <button onClick={() => window.print()} className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm font-medium transition-all active:scale-95 flex items-center space-x-2">
          <FileText size={18} />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Revenue" value={`KSh ${totalRevenue.toLocaleString()}`} icon={<DollarSign size={20} />} trend="+0%" positive={true} />
        <StatCard title="Profit" value={`KSh ${totalRevenue.toLocaleString()}`} icon={<TrendingUp size={20} />} trend="+0%" positive={true} />
        <StatCard title="Outstanding" value={`KSh ${outstandingAmount.toLocaleString()}`} icon={<FileText size={20} />} trend="-0%" positive={true} />
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={<Activity size={20} />} trend="+0%" positive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Monthly Revenue</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `KSh ${value}`} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Aging */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Invoice Aging</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `KSh ${value}`} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="amount" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 transition-all hover:shadow-md">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Payment Methods</h2>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip prefix="%" />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#6b7280' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports & Insights wrapper */}
        <div className="space-y-6 lg:col-span-2">
          {/* Business Insights */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 p-6 rounded-2xl border border-indigo-100/60 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Lightbulb size={120} />
            </div>
            <div className="flex items-center space-x-2 mb-5 relative z-10">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Lightbulb className="text-indigo-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-indigo-900">AI Business Insights</h2>
            </div>
            <ul className="space-y-4 relative z-10">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex items-start bg-white/60 p-3 rounded-xl backdrop-blur-sm border border-white/50">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold mr-3 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="text-indigo-900 font-medium text-sm leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quote Metrics */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-5">Quote Performance</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Created</span>
                  <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm">{totalQuotes}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Accepted</span>
                  <span className="font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">{acceptedQuotes}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Rejected</span>
                  <span className="font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full text-sm">{rejectedQuotes}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-900 font-bold">Conversion Rate</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-sm">{conversionRate}%</span>
                </div>
              </div>
            </div>

            {/* Customer Leaderboard */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex items-center space-x-2 mb-5">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Award className="text-yellow-500" size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Top Customers</h2>
              </div>
              <div className="space-y-5">
                {topCustomers.map((cust, idx) => (
                  <div key={cust.id} className="flex justify-between items-center group">
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm border
                        ${idx === 0 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                          idx === 1 ? 'bg-gray-100 text-gray-600 border-gray-200' : 
                          idx === 2 ? 'bg-orange-50 text-orange-700 border-orange-100' : 
                          'bg-slate-50 text-slate-500 border-slate-100'}`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{cust.name}</p>
                        <p className="text-xs text-gray-500 font-medium">{cust.invoices} invoices</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md text-sm">{cust.revenue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, positive }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-md hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-bold text-gray-500">{title}</p>
        <div className="p-2 bg-blue-50/50 text-blue-600 rounded-xl">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{value}</h3>
      <div className="flex items-center mt-auto">
        <div className={`flex items-center px-2 py-1 rounded-md text-xs font-bold ${positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {positive ? (
            <TrendingUp size={14} className="mr-1" />
          ) : (
            <TrendingDown size={14} className="mr-1" />
          )}
          {trend}
        </div>
        <span className="text-xs text-gray-400 font-medium ml-2">vs last month</span>
      </div>
    </div>
  );
}
