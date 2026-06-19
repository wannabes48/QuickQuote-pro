import React from 'react';
import { AppLogo, AppLogoDarkText } from '@/components/ui/logo';
import { Link } from 'react-router-dom';
import { Pricing2 } from '@/components/ui/pricing-cards';
import FeatureCarousel from '@/components/ui/feature-carousel';
import { MeshGradient } from "@paper-design/shaders-react";
import Footer from '@/components/ui/footer';
import GradientCardDemo from '@/components/ui/gradient-card-demo';

import { PublicNavBar } from '@/components/ui/public-navbar';

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

      {/* Hero Section */}
      <main className="flex-grow flex flex-col relative z-10 bg-zinc-950/20 shadow-2xl pb-10">
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
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

            {/* Simple Mockup/Preview Graphic */}
            <div className="mt-24 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/20">
                <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="p-8 text-left bg-gray-50">
                  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-md mx-auto">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">QUICKQUOTE PRO</h3>
                        <p className="text-sm text-gray-500">Quote #0001</p>
                      </div>
                      <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">ACCEPTED</div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm border-b pb-2">
                        <span className="text-gray-500">Solar installation</span>
                        <span className="font-semibold text-gray-900">KSh 15,080</span>
                      </div>
                      <button className="w-full py-2 bg-gray-100 text-gray-500 rounded font-medium text-sm border border-gray-200">Convert to Invoice</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Carousel */}
        <div className="relative z-20 mt-12 mb-12">
          <FeatureCarousel />
        </div>

        {/* Gradient Cards Demo Section */}
        <div className="relative z-20 mb-12 bg-zinc-950/40">
          <GradientCardDemo />
        </div>

        {/* Pricing Section stays at the bottom, overlapping the fixed background with its own dark background */}
        <div className="relative z-20 mb-20">
          <Pricing2 />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;
