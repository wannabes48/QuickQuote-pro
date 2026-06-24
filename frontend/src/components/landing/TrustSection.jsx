import React from 'react';

export function TrustSection() {
  return (
    <section className="py-16 bg-transparent border-t border-b border-white/5 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
            Trusted by Contractors Across East Africa
          </h2>
        </div>
        
        {/* Logos Placeholder */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 mb-16">
          <div className="text-xl font-black text-white tracking-tighter">BUILD<span className="text-blue-500">CO</span></div>
          <div className="text-xl font-bold text-white tracking-widest italic">ElectroTech</div>
          <div className="text-xl font-bold text-white tracking-tight uppercase">PrimePlumb</div>
          <div className="text-xl font-bold text-white">Solar<span className="text-yellow-500">Grid</span></div>
          <div className="text-xl font-serif text-white italic">Apex Contractors</div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-4xl font-extrabold text-blue-400 mb-2">10,000+</div>
            <div className="text-gray-400 font-medium">Quotes Generated</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-4xl font-extrabold text-white mb-2">1,500+</div>
            <div className="text-gray-400 font-medium">Active Contractors</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="text-4xl font-extrabold text-green-400 mb-2">KSh 50M+</div>
            <div className="text-gray-400 font-medium">Processed Value</div>
          </div>
        </div>
      </div>
    </section>
  );
}
