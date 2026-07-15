import React, { useState } from 'react';
import { 
  DollarSign, Clock, AlertCircle, Wallet, Search, Filter, 
  Download, Eye, Send, X, CreditCard, Calendar, FileText, 
  ArrowUpRight, Bell, Check
} from 'lucide-react';

const OVERVIEW_STATS = [
  { label: 'Total Received', amount: '$124,500', trend: '+12.5%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { label: 'Outstanding', amount: '$32,200', trend: '-2.4%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Overdue', amount: '$8,400', trend: '+4.1%', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
  { label: 'This Month', amount: '$45,800', trend: '+8.2%', icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-100' },
];

const TRANSACTIONS = [
  { id: 'PAY-1042', invoice: 'INV-2023-081', customer: 'Acme Corp', amount: 4500, method: 'Credit Card', status: 'Completed', date: 'Oct 24, 2023', deposit: false },
  { id: 'PAY-1043', invoice: 'INV-2023-082', customer: 'Stark Industries', amount: 12000, method: 'Bank Transfer', status: 'Pending', date: 'Oct 25, 2023', deposit: true },
  { id: 'PAY-1044', invoice: 'INV-2023-083', customer: 'Wayne Enterprises', amount: 2100, method: 'Check', status: 'Failed', date: 'Oct 22, 2023', deposit: false },
  { id: 'PAY-1045', invoice: 'INV-2023-084', customer: 'LexCorp', amount: 8500, method: 'Credit Card', status: 'Completed', date: 'Oct 26, 2023', deposit: true },
  { id: 'PAY-1046', invoice: 'INV-2023-085', customer: 'Oscorp', amount: 1200, method: 'Cash', status: 'Overdue', date: 'Oct 15, 2023', deposit: false },
  { id: 'PAY-1047', invoice: 'INV-2023-086', customer: 'Global Dynamics', amount: 3400, method: 'Credit Card', status: 'Completed', date: 'Oct 27, 2023', deposit: false },
];

const REMINDERS = [
  { id: 1, customer: 'Oscorp', invoice: 'INV-2023-085', amount: '$1,200', daysOverdue: 12, type: 'overdue' },
  { id: 2, customer: 'Initech', invoice: 'INV-2023-079', amount: '$4,500', daysOverdue: 5, type: 'overdue' },
  { id: 3, customer: 'Umbrella Corp', invoice: 'INV-2023-088', amount: '$2,000', daysOverdue: 0, type: 'upcoming' },
];

const DEPOSITS = [
  { id: 'DEP-001', customer: 'Stark Industries', project: 'Arc Reactor Upgrade', amount: '$12,000', status: 'Awaiting', date: 'Oct 28, 2023' },
  { id: 'DEP-002', customer: 'LexCorp', project: 'R&D Lab Expansion', amount: '$8,500', status: 'Paid', date: 'Oct 26, 2023' },
];

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 ring-emerald-600/20';
      case 'Pending': return 'bg-amber-100 text-amber-700 ring-amber-600/20';
      case 'Overdue': return 'bg-rose-100 text-rose-700 ring-rose-600/20';
      case 'Failed': return 'bg-slate-100 text-slate-700 ring-slate-600/20';
      default: return 'bg-gray-100 text-gray-700 ring-gray-600/20';
    }
  };

  const handleRowClick = (tx) => {
    setSelectedTransaction(tx);
    setIsDrawerOpen(true);
  };

  const filteredTransactions = TRANSACTIONS.filter(t => 
    t.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.invoice.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments</h1>
          <p className="text-slate-500 mt-2">Manage invoices, deposits, and track your revenue.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Record Payment
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {OVERVIEW_STATS.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.amount}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className={`font-medium ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trend}
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search customer or invoice..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:border-indigo-500">
                  <option>All Statuses</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Overdue</option>
                </select>
                <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:border-indigo-500">
                  <option>All Methods</option>
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                  <option>Check</option>
                  <option>Cash</option>
                </select>
                <button className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" /> Range
                </button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                    <th className="px-6 py-4 font-medium">Invoice</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr 
                      key={tx.id} 
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => handleRowClick(tx)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          <span className="font-medium text-slate-900">{tx.invoice}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{tx.customer}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">${tx.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusBadge(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{tx.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                            title="View Details"
                            onClick={(e) => { e.stopPropagation(); handleRowClick(tx); }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                            title="Download Receipt"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Send Reminder"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Reminders & Deposits */}
        <div className="space-y-6">
          {/* Smart Reminders */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                  <Bell className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Smart Reminders</h2>
              </div>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
                {REMINDERS.length} Action{REMINDERS.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-3">
              {REMINDERS.map((rem) => (
                <div key={rem.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-slate-900">{rem.customer}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{rem.invoice} • <span className="font-medium text-slate-700">{rem.amount}</span></p>
                    </div>
                    {rem.type === 'overdue' ? (
                      <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {rem.daysOverdue}d Overdue
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <button className="w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Send className="w-3.5 h-3.5" /> Send Reminder
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Deposit Management */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Wallet className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Deposit Management</h2>
            </div>
            
            <div className="space-y-2">
              {DEPOSITS.map((dep) => (
                <div key={dep.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${dep.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{dep.customer}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[140px]">{dep.project}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{dep.amount}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">{dep.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors">
              Manage All Deposits
            </button>
          </div>
        </div>
      </div>

      {/* Payment Details Drawer */}
      {isDrawerOpen && selectedTransaction && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out border-l border-slate-100">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Payment Details</h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Summary */}
              <div className="text-center space-y-3 pt-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm ring-4 ring-emerald-50">
                  <DollarSign className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight">${selectedTransaction.amount.toLocaleString()}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusBadge(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm text-slate-500 font-medium">{selectedTransaction.method}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Transaction ID</span>
                  <span className="text-sm font-mono text-slate-900">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Invoice</span>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    {selectedTransaction.invoice} <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Customer</span>
                  <span className="text-sm font-medium text-slate-900">{selectedTransaction.customer}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Date</span>
                  <span className="text-sm font-medium text-slate-900">{selectedTransaction.date}</span>
                </div>
              </div>

              {/* Payment Timeline */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 mb-5 uppercase tracking-wider">Payment Timeline</h4>
                <div className="relative pl-4 space-y-6">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100" />
                  
                  {[
                    { label: 'Invoice Created', date: 'Oct 20, 2023, 10:00 AM', done: true },
                    { label: 'Quote Approved', date: 'Oct 21, 2023, 02:30 PM', done: true },
                    { label: 'Deposit Paid', date: 'Oct 21, 2023, 02:45 PM', done: true },
                    { label: 'Final Payment Received', date: 'Oct 24, 2023, 11:15 AM', done: selectedTransaction.status === 'Completed' },
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex gap-5">
                      <div className={`absolute -left-[24px] w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${step.done ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm' : 'border-slate-200 bg-white'}`}>
                        {step.done && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div className="pt-0.5">
                        <p className={`text-sm font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                        <p className="text-xs text-slate-500 mt-1">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <Download className="w-4 h-4" /> Receipt
                </button>
                <button className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                  View Invoice
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
