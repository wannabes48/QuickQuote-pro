import React from 'react';
import { LayoutDashboard, Users, FileText, Receipt, CreditCard, BarChart, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export function DashboardPreviewSection() {
  return (
    <section className="py-24 bg-transparent relative z-20 border-t border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Everything In One Place</h2>
          <p className="mt-4 text-xl text-gray-400">Manage your entire contracting business from a beautiful, intuitive dashboard.</p>
        </div>

        {/* Mock Dashboard Window */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-blue-900/20 overflow-hidden flex flex-col md:flex-row h-[600px] max-w-5xl mx-auto">
          
          {/* Sidebar */}
          <div className="hidden md:flex flex-col w-64 bg-zinc-950 border-r border-zinc-800 p-4">
            <div className="flex items-center space-x-2 mb-8 px-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">Q</div>
              <span className="text-white font-bold text-lg tracking-tight">QuickQuote</span>
            </div>
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2 bg-zinc-800 text-white rounded-md font-medium text-sm"><LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard</a>
              <a href="#" className="flex items-center px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-md font-medium text-sm transition-colors"><Users className="w-4 h-4 mr-3" /> Customers</a>
              <a href="#" className="flex items-center px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-md font-medium text-sm transition-colors"><FileText className="w-4 h-4 mr-3" /> Quotes</a>
              <a href="#" className="flex items-center px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-md font-medium text-sm transition-colors"><Receipt className="w-4 h-4 mr-3" /> Invoices</a>
              <a href="#" className="flex items-center px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-md font-medium text-sm transition-colors"><CreditCard className="w-4 h-4 mr-3" /> Payments</a>
              <a href="#" className="flex items-center px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-md font-medium text-sm transition-colors"><BarChart className="w-4 h-4 mr-3" /> Reports</a>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-zinc-900 custom-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">Dashboard Overview</h3>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700"></div>
              </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="text-zinc-500 text-sm font-medium mb-1">Monthly Revenue</div>
                <div className="text-2xl font-bold text-white flex items-center">
                  KSh 450,000 <TrendingUp className="w-4 h-4 text-green-400 ml-2" />
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="text-zinc-500 text-sm font-medium mb-1">Active Quotes</div>
                <div className="text-2xl font-bold text-white flex items-center">
                  24 <Clock className="w-4 h-4 text-yellow-400 ml-2" />
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <div className="text-zinc-500 text-sm font-medium mb-1">Conversion Rate</div>
                <div className="text-2xl font-bold text-white flex items-center">
                  68% <CheckCircle className="w-4 h-4 text-blue-400 ml-2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Fake Chart Area */}
              <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl p-5 h-64 flex flex-col justify-between">
                <div className="text-white font-medium mb-4">Revenue Trend</div>
                {/* Fake bars */}
                <div className="flex items-end space-x-2 h-40">
                  {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                    <div key={i} className="bg-blue-500/80 hover:bg-blue-400 rounded-t-sm flex-1 transition-colors" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between text-zinc-500 text-xs mt-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 h-64 overflow-hidden">
                <div className="text-white font-medium mb-4">Recent Activity</div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 mr-3 shrink-0"></div>
                    <div>
                      <p className="text-sm text-white">Quote Q-0042 Approved</p>
                      <p className="text-xs text-zinc-500">2 mins ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 mr-3 shrink-0"></div>
                    <div>
                      <p className="text-sm text-white">Invoice INV-019 Sent</p>
                      <p className="text-xs text-zinc-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 mr-3 shrink-0"></div>
                    <div>
                      <p className="text-sm text-white">Quote Q-0043 Viewed</p>
                      <p className="text-xs text-zinc-500">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
