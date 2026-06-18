import React from 'react';
import { FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-light">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-dark tracking-tight">QuickQuote Pro</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-gray-dark hover:text-primary font-medium transition-colors">Log in</Link>
              <Link to="/register" className="bg-primary text-white hover:bg-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary font-semibold text-sm">
            Designed for Contractors
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-dark tracking-tight mb-8 leading-tight">
            Create Professional Quotes in <span className="text-primary">Minutes</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
            Generate branded quotations, send them securely via email or SMS, and track customer responses from one simple dashboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-primary hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
              Start Free Trial
            </Link>
            <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-gray-border text-lg font-semibold rounded-xl text-gray-dark bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
              Watch Demo
            </Link>
          </div>

          {/* Simple Mockup/Preview Graphic */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-border overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-border px-4 py-3 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="p-8 text-left bg-gray-50">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-md mx-auto">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-gray-dark text-lg">QUICKQUOTE PRO</h3>
                      <p className="text-sm text-gray-500">Quote #0001</p>
                    </div>
                    <div className="bg-green-100 text-secondary text-xs font-bold px-2 py-1 rounded">ACCEPTED</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm border-b pb-2">
                      <span className="text-gray-500">Solar installation</span>
                      <span className="font-semibold text-gray-dark">KSh 15,080</span>
                    </div>
                    <button className="w-full py-2 bg-gray-100 text-gray-500 rounded font-medium text-sm">Convert to Invoice</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
