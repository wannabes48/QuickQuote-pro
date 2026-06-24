import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

export function FinalCTASection() {
  return (
    <section className="relative py-24 z-20 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-blue-900/20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"></div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
          Stop Wasting Hours <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Creating Quotes</span>
        </h2>
        
        <p className="mt-4 text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
          Join contractors who create professional quotations in minutes, close deals faster, and get paid on time.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Link 
            to="/register" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-blue-900 bg-white hover:bg-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
          >
            Start Free Trial <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/register" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 text-lg font-bold rounded-xl text-white bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/30 transition-all duration-300"
          >
            <Calendar className="w-5 h-5 mr-2" /> Schedule Demo
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-400">No credit card required • 14-day free trial • Cancel anytime</p>
      </div>
    </section>
  );
}
