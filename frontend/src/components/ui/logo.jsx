import React from 'react';

export function AppLogo({ className, ...props }) {
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <defs>
        <linearGradient id="docGradient" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="foldGradient" x1="60" y1="10" x2="90" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="checkGradient" x1="30" y1="80" x2="90" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ade80" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
      </defs>
      
      {/* Document Base (white background to hide background behind the document) */}
      <path d="M65 15H30C21.7157 15 15 21.7157 15 30V90C15 98.2843 21.7157 105 30 105H70C78.2843 105 85 98.2843 85 90V40L65 15Z" fill="white" />
      
      {/* Main outline */}
      <path d="M65 15H30C21.7157 15 15 21.7157 15 30V90C15 98.2843 21.7157 105 30 105H70C78.2843 105 85 98.2843 85 90V40L65 15Z" stroke="url(#docGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Folded Corner Base */}
      <path d="M65 15V30C65 35.5228 69.4772 40 75 40H85L65 15Z" fill="url(#foldGradient)" />
      
      {/* Folded Corner Curve Line */}
      <path d="M65 15V30C65 35.5228 69.4772 40 75 40H85" stroke="url(#docGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Checkmark */}
      <path d="M30 65L45 80L90 35" stroke="url(#checkGradient)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function AppLogoText({ className, showTagline = false }) {
  return (
    <div className={`flex flex-col justify-center ${className || ''}`}>
      <div className="font-extrabold tracking-tight">
        <span className="text-slate-900 dark:text-white">QuickQuote</span>
        <span className="text-blue-600 ml-1">Pro</span>
      </div>
      {showTagline && (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-1">
          Professional quotations, Accuracy & approval
        </span>
      )}
    </div>
  );
}

export function AppLogoDarkText({ className, showTagline = false }) {
  return (
    <div className={`flex flex-col justify-center ${className || ''}`}>
      <div className="font-extrabold tracking-tight">
        <span className="text-white">QuickQuote</span>
        <span className="text-blue-400 ml-1">Pro</span>
      </div>
      {showTagline && (
        <span className="text-xs text-white/60 font-medium tracking-wide mt-1">
          Professional quotations, Accuracy & approval
        </span>
      )}
    </div>
  );
}
