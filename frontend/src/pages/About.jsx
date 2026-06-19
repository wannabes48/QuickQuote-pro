import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MeshGradient } from "@paper-design/shaders-react";
import { PublicNavBar } from '@/components/ui/public-navbar';
import Footer from '@/components/ui/footer';
import { Users, History, Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const team = [
  {
    name: 'Sarah Jenkins',
    role: 'CEO & Founder',
    image: 'https://i.pravatar.cc/300?img=47'
  },
  {
    name: 'David Okafor',
    role: 'Chief Technology Officer',
    image: 'https://i.pravatar.cc/300?img=11'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Head of Design',
    image: 'https://i.pravatar.cc/300?img=5'
  },
  {
    name: 'Marcus Chen',
    role: 'Lead Developer',
    image: 'https://i.pravatar.cc/300?img=14'
  }
];

export default function About() {
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

      <main className="flex-grow relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-32">
        
        {/* Hero Section */}
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Built for modern
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              businesses.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            We're on a mission to completely eliminate the friction between sending a quote and getting paid.
          </motion.p>
        </div>

        {/* History / Mission */}
        <section id="history" className="scroll-mt-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium">
                <History className="w-4 h-4" /> Our Story
              </div>
              <h2 className="text-4xl font-bold tracking-tight">How it all started.</h2>
              <div className="space-y-4 text-white/70 leading-relaxed text-lg">
                <p>
                  QuickQuote Pro was born out of frustration. As freelancers and agency owners, we spent hours every week drafting manual Word documents, exporting PDFs, and chasing clients for approvals and payments.
                </p>
                <p>
                  We realized that the barrier between a "Yes" from a client and cash in the bank was filled with unnecessary friction. We built QuickQuote Pro to solve our own problem—creating a seamless, end-to-end pipeline from quotation to Daraja payment.
                </p>
              </div>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Team collaborating" className="object-cover w-full h-full opacity-80" />
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="scroll-mt-24">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mx-auto">
              <Users className="w-4 h-4" /> The Team
            </div>
            <h2 className="text-4xl font-bold tracking-tight">Meet the builders.</h2>
            <p className="text-white/60 max-w-2xl mx-auto">A small, passionate team dedicated to making your workflow flawless.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={member.name} 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/10 object-cover" />
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-blue-400 font-medium mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Careers */}
        <section id="careers" className="scroll-mt-24">
          <div className="bg-gradient-to-br from-blue-900/40 to-emerald-900/40 border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium mx-auto">
                <Briefcase className="w-4 h-4" /> Join Us
              </div>
              <h2 className="text-4xl font-bold tracking-tight">We are hiring!</h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Want to help us revolutionize how businesses handle their operations? We're always looking for talented engineers, designers, and marketers.
              </p>
              <button className="inline-flex items-center gap-2 bg-white text-zinc-950 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                View Open Positions <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
