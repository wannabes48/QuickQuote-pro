import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How does QuickQuote Pro work?",
    answer: "Simply create an account, add your business details, and start building quotes. You can select pre-built templates, add your items, and instantly generate a professional PDF. You can then send this to your client via email or SMS directly from the platform."
  },
  {
    question: "Can I send quotes via WhatsApp?",
    answer: "Yes! QuickQuote Pro integrates seamlessly with WhatsApp. You can share secure links to your quotes or send the generated PDFs directly to your client's WhatsApp number with a single click."
  },
  {
    question: "Do you support M-Pesa?",
    answer: "Absolutely. We offer a direct Daraja API M-Pesa integration. When you convert an approved quote into an invoice, your clients will see an 'Pay with M-Pesa' button that triggers an STK push directly to their phone."
  },
  {
    question: "Can I customize PDFs?",
    answer: "Yes. You can upload your company logo, set your brand colors, and add custom terms and conditions to ensure every generated PDF perfectly matches your business identity."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a 14-day free trial on all our plans. No credit card is required to sign up. You can explore all premium features and see how much time it saves your business before committing."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-transparent relative z-20 border-t border-zinc-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-gray-400">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border ${openIndex === index ? 'border-blue-500/50 bg-blue-900/10' : 'border-zinc-800 bg-zinc-900/30'} rounded-2xl overflow-hidden transition-all duration-300`}
            >
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-white">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180 text-blue-400' : ''}`} />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
