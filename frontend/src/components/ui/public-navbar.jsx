import React from 'react';
import { Link } from 'react-router-dom';
import { AppLogo, AppLogoDarkText } from '@/components/ui/logo';

export function PublicNavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 w-full transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
              <AppLogo className="h-8 w-auto sm:h-10 shrink-0" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Pricing</a>
            <a href="#industries" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Industries</a>
            <a href="#blog" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Blog</a>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link 
              to="/login" 
              className="text-white hover:text-blue-200 text-sm sm:text-base font-medium transition-colors drop-shadow-sm whitespace-nowrap"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-blue-900 hover:bg-gray-100 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
