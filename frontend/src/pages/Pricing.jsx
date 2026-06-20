import React from 'react';
import { Link } from 'react-router-dom';
import { AppLogo, AppLogoDarkText } from '@/components/ui/logo';
import { ModernPricingPage } from "@/components/ui/animated-glassy-pricing";
import { MeshGradient } from "@paper-design/shaders-react";

const myPricingPlans = [
  { 
    planName: 'Starter', 
    description: 'Perfect for solopreneurs getting started.', 
    price: '499', 
    features: ['Up to 50 quotes/month', 'PDF Generation', 'Email & SMS sending'], 
    buttonText: 'Start Free Trial', 
    buttonVariant: 'secondary'
  },
  { 
    planName: 'Professional', 
    description: 'For growing businesses needing more power.', 
    price: '1,500', 
    features: ['Unlimited quotes', '1-Click Invoice Generation', 'E-Signatures'], 
    buttonText: 'Start Professional Trial', 
    isPopular: true, 
    buttonVariant: 'primary' 
  },
  { 
    planName: 'Business', 
    description: 'Advanced features for established teams.', 
    price: '3,500', 
    features: ['Team accounts', 'M-Pesa STK Push Integration', 'WhatsApp Delivery'], 
    buttonText: 'Start Free Trial', 
    buttonVariant: 'secondary' 
  },
];

import { PublicNavBar } from '@/components/ui/public-navbar';

export default function Pricing() {
  return (
    <div className="dark min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-x-hidden">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-90">
        <MeshGradient
          style={{ height: "100%", width: "100%" }}
          distortion={0.8}
          swirl={0.1}
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={1}
          colors={["hsl(216, 90%, 27%)", "hsl(243, 68%, 36%)", "hsl(205, 91%, 64%)", "hsl(211, 61%, 57%)"]}
        />
      </div>

      <PublicNavBar />

      <div className="flex-grow pt-12 pb-24 relative z-10 bg-zinc-950/20 shadow-2xl">
          <ModernPricingPage
              title={
                  <>
                      Simple, <span className="text-blue-300">transparent</span> pricing
                  </>
              }
              subtitle="Choose the perfect plan for your contracting business."
              plans={myPricingPlans}
          />
      </div>
    </div>
  );
}
