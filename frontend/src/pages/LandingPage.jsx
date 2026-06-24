import React from 'react';
import { Link } from 'react-router-dom';
import { MeshGradient } from "@paper-design/shaders-react";

// Existing Components
import { PublicNavBar } from '@/components/ui/public-navbar';
import { Pricing2 } from '@/components/ui/pricing-cards';
import Footer from '@/components/ui/footer';

// New SaaS Sections
import { TrustSection } from '../components/landing/TrustSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { IndustriesSection } from '../components/landing/IndustriesSection';
import { DashboardPreviewSection } from '../components/landing/DashboardPreviewSection';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FAQSection } from '../components/landing/FAQSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';

import GradientCardDemo from '@/components/ui/gradient-card-demo';

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 relative overflow-x-hidden">
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

      <main className="flex-grow flex flex-col relative z-10 w-full bg-zinc-950/20 shadow-2xl pb-10">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm shadow-xl">
              Designed for Contractors
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight drop-shadow-2xl">
              Create Professional Quotes in <span className="text-blue-300">Minutes</span>
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-medium">
              Generate branded quotations, send them securely via email or SMS, and track customer responses from one simple dashboard.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-blue-900 bg-white hover:bg-gray-100 shadow-2xl hover:-translate-y-0.5 transition-all duration-200">
                Start Free Trial
              </Link>
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-white/20 text-lg font-bold rounded-xl text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 shadow-xl">
                Watch Demo
              </Link>
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <TrustSection />

        {/* FEATURES SECTION */}
        <FeaturesSection />

        {/* HOW IT WORKS SECTION */}
        <HowItWorksSection />

        {/* DASHBOARD PREVIEW SECTION */}
        <DashboardPreviewSection />

        {/* INDUSTRIES SECTION */}
        <IndustriesSection />

        {/* BENEFITS SECTION */}
        <BenefitsSection />

        {/* TESTIMONIALS SECTION */}
        <TestimonialsSection />

        {/* GRADIENT CARD DEMO SECTION */}
        <div className="relative z-20 mb-12 bg-zinc-950/40">
          <GradientCardDemo />
        </div>

        {/* PRICING SECTION */}
        <div id="pricing" className="relative z-20 py-12 bg-zinc-950">
          <Pricing2 />
        </div>

        {/* FAQ SECTION */}
        <FAQSection />

        {/* FINAL CTA SECTION */}
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
