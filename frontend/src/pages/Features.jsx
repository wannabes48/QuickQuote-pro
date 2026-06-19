import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MeshGradient } from "@paper-design/shaders-react";
import { PublicNavBar } from '@/components/ui/public-navbar';
import Footer from '@/components/ui/footer';
import { FileText, Receipt, CreditCard, LineChart, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    id: 'quotes',
    icon: <FileText className="w-12 h-12 text-blue-400" />,
    title: 'Lightning-Fast Quotations',
    description: 'Create professional, branded quotations in seconds. Our interactive quote builder allows you to drag and drop services, adjust quantities, and instantly preview what your clients will see.',
    benefits: ['Custom Branding', 'Mobile-Friendly Previews', '1-Click Send via Email/SMS']
  },
  {
    id: 'invoices',
    icon: <Receipt className="w-12 h-12 text-emerald-400" />,
    title: 'Seamless Invoicing',
    description: 'Once a client accepts your quote, convert it to a legally binding invoice with a single click. Keep track of what has been paid and what is outstanding automatically.',
    benefits: ['Auto-Conversion from Quotes', 'Payment Terms Customization', 'PDF Export']
  },
  {
    id: 'payments',
    icon: <CreditCard className="w-12 h-12 text-orange-400" />,
    title: 'Integrated Daraja Payments',
    description: 'Get paid faster. We integrate directly with Daraja M-Pesa APIs so your customers can pay you instantly directly from the invoice link. Reconciliations happen automatically.',
    benefits: ['Instant M-Pesa Prompts', 'Zero Manual Reconciliation', 'Secure Transactions']
  },
  {
    id: 'tracking',
    icon: <LineChart className="w-12 h-12 text-purple-400" />,
    title: 'Tracking & Analytics',
    description: 'Know exactly when your clients open your quotes. Our tracking engine gives you read receipts, time-spent analytics, and conversion rates right on your dashboard.',
    benefits: ['Read Receipts', 'Conversion Tracking', 'Revenue Forecasting']
  }
];

export default function Features() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-x-hidden text-white font-sans">
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

      <main className="flex-grow relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Powerful Features.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Simple Execution.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-3xl mx-auto"
          >
            Everything you need to manage your quotes, invoices, and payments in one streamlined platform.
          </motion.p>
        </div>

        <div className="space-y-32">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.id}
              id={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center`}
            >
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl backdrop-blur-md shadow-2xl border border-white/10">
                  {feature.icon}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{feature.title}</h2>
                <p className="text-lg text-white/70 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3 pt-4">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/90 font-medium">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-emerald-500/20 rounded-3xl blur-3xl" />
                <div className="relative aspect-square md:aspect-[4/3] bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex items-center justify-center overflow-hidden shadow-2xl">
                    {/* Placeholder for feature screenshot */}
                    <div className="w-full h-full border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center text-white/40 font-medium">
                       Interface Preview: {feature.title}
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
