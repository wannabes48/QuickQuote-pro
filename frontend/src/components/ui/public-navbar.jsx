import React from 'react';
import { Link } from 'react-router-dom';
import { AppLogo, AppLogoDarkText } from '@/components/ui/logo';

export function PublicNavBar() {
  return (
    <nav className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm shrink-0">
              <AppLogo className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            {/* Hide text on very small mobile devices, show on small tablets and up */}
            <AppLogoDarkText className="hidden sm:flex text-xl sm:text-2xl ml-3 drop-shadow-md text-white" />
            <span className="sm:hidden ml-2 font-extrabold text-white text-lg tracking-tight">QQP</span>
          </Link>
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link 
              to="/login" 
              className="text-white hover:text-blue-200 text-sm sm:text-base font-medium transition-colors drop-shadow-sm whitespace-nowrap"
            >
              Log in
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-blue-900 hover:bg-gray-100 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg font-bold text-sm sm:text-base shadow-lg transition-all whitespace-nowrap"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
