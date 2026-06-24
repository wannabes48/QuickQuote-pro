import React from 'react';
import { FileText, FileDown, Receipt, Send, Eye, Users, Smartphone, Wrench } from 'lucide-react';

const features = [
  {
    title: "Quote Builder",
    description: "Create professional quotes in minutes with our intuitive, drag-and-drop quote builder.",
    icon: <FileText className="w-6 h-6 text-blue-400" />
  },
  {
    title: "PDF Generation",
    description: "Instantly generate beautiful, branded PDF documents that impress your clients.",
    icon: <FileDown className="w-6 h-6 text-purple-400" />
  },
  {
    title: "Invoice Management",
    description: "Convert approved quotes into invoices with a single click. Keep track of what's owed.",
    icon: <Receipt className="w-6 h-6 text-green-400" />
  },
  {
    title: "Email & SMS Delivery",
    description: "Send quotes directly to your clients via email or SMS with integrated tracking.",
    icon: <Send className="w-6 h-6 text-yellow-400" />
  },
  {
    title: "Quote Tracking",
    description: "Know exactly when clients open your quotes and get notified upon approval.",
    icon: <Eye className="w-6 h-6 text-cyan-400" />
  },
  {
    title: "Customer Management",
    description: "Maintain a built-in CRM for all your clients, keeping contact details organized.",
    icon: <Users className="w-6 h-6 text-pink-400" />
  },
  {
    title: "M-Pesa Integration",
    description: "Allow clients to pay invoices instantly via M-Pesa STK push for faster payments.",
    icon: <Smartphone className="w-6 h-6 text-green-500" />
  },
  {
    title: "Contractor Templates",
    description: "Start instantly with pre-built templates for electricians, plumbers, and builders.",
    icon: <Wrench className="w-6 h-6 text-orange-400" />
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-transparent relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-blue-500 font-semibold tracking-wide uppercase mb-3">Powerful Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Everything you need to run your contracting business
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            QuickQuote Pro is designed to eliminate paperwork, save you hours, and help you close deals faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
