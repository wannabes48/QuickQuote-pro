import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MeshGradient } from "@paper-design/shaders-react";
import { PublicNavBar } from '@/components/ui/public-navbar';
import Footer from '@/components/ui/footer';
import { MessageCircle, HelpCircle, ChevronDown, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How do I create a new quotation?",
    answer: "Once you log into your dashboard, click the 'New Quote' button. You can easily drag and drop items from your pre-saved catalog or manually enter them, preview the quote, and send it instantly."
  },
  {
    question: "How does Daraja M-Pesa integration work?",
    answer: "We connect directly to Safaricom's Daraja APIs. When your client clicks the 'Pay Now' link on your invoice, they simply enter their phone number and M-Pesa PIN on their device. Our system automatically detects the payment and marks the invoice as Paid."
  },
  {
    question: "Can I customize the branding of my quotes?",
    answer: "Absolutely! You can upload your company logo, choose your brand colors, and add custom terms and conditions that will appear at the bottom of every quote and invoice."
  },
  {
    question: "Is there a limit to how many quotes I can send?",
    answer: "This depends on your pricing plan. Our free tier allows up to 10 quotes per month, while the Pro tier offers unlimited quotations."
  },
  {
    question: "How do I track if a client has viewed my quote?",
    answer: "Every quote sent via QuickQuote Pro includes a unique secure link. Our system tracks when this link is opened, and you will see a 'Viewed' status on your dashboard alongside the exact timestamp."
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors focus:outline-none"
      >
        <span className="font-bold text-lg">{question}</span>
        <ChevronDown className={`w-5 h-5 text-blue-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-white/70 leading-relaxed border-t border-white/5 pt-4 mt-2 mx-2">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQ() {
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

      <main className="flex-grow relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-32">
        
        {/* Hero Section */}
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            How can we
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              help you?
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Find answers to common questions or reach out directly to our support team.
          </motion.p>
        </div>

        {/* FAQs */}
        <section id="faqs" className="scroll-mt-24 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium">
            <HelpCircle className="w-4 h-4" /> FAQs
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        {/* Support Contact */}
        <section id="support" className="scroll-mt-24">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium">
                  <MessageCircle className="w-4 h-4" /> Support
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Still need help?</h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  Can't find the answer you're looking for? Our dedicated support team is available 24/7 to help you get the most out of QuickQuote Pro. Drop us a message!
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="text-sm font-medium text-white/60 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="you@company.com" 
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/60 ml-1">Message</label>
                  <textarea 
                    rows="4"
                    placeholder="How can we help?" 
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors text-white placeholder:text-white/30 resize-none"
                  ></textarea>
                </div>
                <button className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-4 rounded-xl transition-colors mt-2">
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
