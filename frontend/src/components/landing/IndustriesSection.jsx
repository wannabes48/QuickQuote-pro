import React from 'react';
import { Zap, Droplet, Sun, Paintbrush, Hammer, HardHat, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const industries = [
  {
    id: 'electricians',
    title: 'Electricians',
    desc: 'Generate precise electrical estimates and compliance certificates on the go.',
    icon: <Zap className="w-8 h-8 text-yellow-400" />
  },
  {
    id: 'plumbers',
    title: 'Plumbers',
    desc: 'Quote for parts and labor instantly while inspecting plumbing issues on-site.',
    icon: <Droplet className="w-8 h-8 text-blue-400" />
  },
  {
    id: 'solar-installers',
    title: 'Solar Installers',
    desc: 'Calculate complex solar panel installations, inverters, and battery requirements easily.',
    icon: <Sun className="w-8 h-8 text-orange-400" />
  },
  {
    id: 'painters',
    title: 'Painters',
    desc: 'Provide accurate painting quotes based on square footage and material costs.',
    icon: <Paintbrush className="w-8 h-8 text-pink-400" />
  },
  {
    id: 'carpenters',
    title: 'Carpenters',
    desc: 'Create detailed quotes for custom woodwork, cabinetry, and structural carpentry.',
    icon: <Hammer className="w-8 h-8 text-amber-600" />
  },
  {
    id: 'general-contractors',
    title: 'General Contractors',
    desc: 'Manage large construction projects with multi-phase quoting and invoicing.',
    icon: <HardHat className="w-8 h-8 text-white" />
  }
];

export function IndustriesSection() {
  return (
    <section id="industries" className="py-24 bg-transparent relative z-20 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Built for Your Industry</h2>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
            QuickQuote Pro adapts to your specific trade with custom templates and tailored features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind, i) => (
            <div key={i} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 hover:bg-zinc-800/50 transition-colors duration-300 flex flex-col h-full">
              <div className="mb-6">{ind.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{ind.title}</h3>
              <p className="text-gray-400 flex-grow mb-6">{ind.desc}</p>
              <Link to={`/industries/${ind.id}`} className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors group">
                Learn More <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
