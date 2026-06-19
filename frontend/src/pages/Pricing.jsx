import React from 'react';
import { Link } from 'react-router-dom';
import { AppLogo, AppLogoDarkText } from '@/components/ui/logo';
import { ModernPricingPage } from "@/components/ui/animated-glassy-pricing";

const myPricingPlans = [
  { 
    planName: 'Starter', 
    description: 'Perfect for new freelancers to win their first clients.', 
    price: '0', 
    features: ['Up to 5 Quotes/mo', '1 User', 'Basic Templates', 'Standard Support'], 
    buttonText: 'Start for Free', 
    buttonVariant: 'secondary'
  },
  { 
    planName: 'Pro', 
    description: 'Everything you need to quote like a professional.', 
    price: '15', 
    features: ['Unlimited Quotes', 'Custom Branding', 'Online Payments', 'Priority Support'], 
    buttonText: 'Get Pro', 
    isPopular: true, 
    buttonVariant: 'primary' 
  },
  { 
    planName: 'Agency', 
    description: 'Powerful tools for growing teams and agencies.', 
    price: '49', 
    features: ['Up to 5 Team Members', 'Client Portal', 'Custom Domain', '24/7 Dedicated Support'], 
    buttonText: 'Contact Us', 
    buttonVariant: 'secondary' 
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-x-hidden">
      {/* Navigation matching LandingPage */}
      <nav className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <AppLogo className="h-8 w-8" />
              </div>
              <AppLogoDarkText className="text-2xl ml-3 drop-shadow-md text-white" />
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-white hover:text-blue-200 font-medium transition-colors drop-shadow-sm">Log in</Link>
              <Link to="/register" className="bg-white text-blue-900 hover:bg-gray-100 px-5 py-2.5 rounded-lg font-bold shadow-lg transition-all">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow pt-12 pb-24 relative z-10">
          <ModernPricingPage
              title={
                  <>
                      Find the <span className="text-blue-400">Perfect Plan</span> for Your Business
                  </>
              }
              subtitle="Start for free, then grow with us. Flexible plans for professionals of all sizes."
              plans={myPricingPlans}
          />
      </div>
    </div>
  );
}
