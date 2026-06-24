import React from 'react';
import { UserPlus, Edit3, Send, CheckCircle, Receipt } from 'lucide-react';

const steps = [
  { id: 1, title: 'Create Customer', desc: 'Add client details to your built-in CRM.', icon: <UserPlus className="w-5 h-5" /> },
  { id: 2, title: 'Build Quote', desc: 'Add line items, calculate taxes, and apply discounts.', icon: <Edit3 className="w-5 h-5" /> },
  { id: 3, title: 'Send Quote', desc: 'Email or SMS the quote directly to your client.', icon: <Send className="w-5 h-5" /> },
  { id: 4, title: 'Get Approval', desc: 'Client reviews and approves the quote online.', icon: <CheckCircle className="w-5 h-5" /> },
  { id: 5, title: 'Convert to Invoice', desc: 'Instantly generate an invoice from the approved quote.', icon: <Receipt className="w-5 h-5" /> }
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-transparent relative z-20 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-xl text-gray-400">A seamless workflow from first contact to final payment.</p>
        </div>

        <div className="relative">
          {/* Desktop horizontal line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -translate-y-1/2 z-0"></div>
          {/* Mobile vertical line */}
          <div className="md:hidden absolute top-0 bottom-0 left-8 w-0.5 bg-zinc-800 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-row md:flex-col items-center md:items-center text-left md:text-center group">
                <div className="w-16 h-16 shrink-0 bg-zinc-900 border-2 border-zinc-700 rounded-full flex items-center justify-center text-blue-400 group-hover:border-blue-500 group-hover:bg-blue-900/20 transition-colors duration-300">
                  {step.icon}
                </div>
                <div className="ml-6 md:ml-0 md:mt-6">
                  <div className="text-sm font-bold text-blue-500 mb-1">Step {step.id}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
