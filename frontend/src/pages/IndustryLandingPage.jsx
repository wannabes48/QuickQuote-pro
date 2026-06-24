import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { industryData } from '../data/industries';
import { PublicNavBar } from '@/components/ui/public-navbar';
import Footer from '@/components/ui/footer';
import { ChevronDown, ArrowRight, CheckCircle2, Star, Download } from 'lucide-react';

export default function IndustryLandingPage() {
  const { industryId } = useParams();
  const data = industryData[industryId];

  if (!data) {
    return <Navigate to="/" replace />;
  }

  // Dynamic SEO Injection
  useEffect(() => {
    document.title = data.seo.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", data.seo.description);
    }
  }, [data]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 overflow-x-hidden">
      <PublicNavBar />

      <main className="flex-grow flex flex-col relative z-10 w-full">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-20 border-b border-zinc-900">
          <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                  {data.hero.headline}
                </h1>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed font-medium">
                  {data.hero.subheadline}
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-blue-900 bg-white hover:bg-gray-100 shadow-xl transition-all">
                    Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
              
              {/* Dashboard Fake UI Graphic */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-white rounded-xl p-6 text-zinc-900">
                  <h3 className="font-bold text-xl mb-1">{data.hero.dashboardHighlight.title}</h3>
                  <div className="text-sm text-gray-500 mb-6">Quote #1042</div>
                  <div className="space-y-4">
                    {data.hero.dashboardHighlight.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b pb-2">
                        <span className="text-gray-700 font-medium">{item}</span>
                        <span className="text-blue-600 font-bold">KSh {(idx + 1) * 4500}</span>
                      </div>
                    ))}
                    <button className="w-full mt-4 bg-zinc-100 text-zinc-500 py-2 rounded-lg font-bold text-sm">Convert to Invoice</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAIN POINTS */}
        <section className="py-24 bg-zinc-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white text-center mb-16">Common Challenges {data.name} Face</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.painPoints.map((point, idx) => (
                <div key={idx} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-800/50 transition-all">
                  <h3 className="text-lg font-bold text-red-400 mb-2">{point.title}</h3>
                  <p className="text-gray-400 text-sm">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-24 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white text-center mb-16">{data.features.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.features.list.map((feat, idx) => (
                <div key={idx} className="bg-blue-900/5 border border-blue-900/20 p-8 rounded-2xl">
                  <h3 className="text-xl font-bold text-blue-400 mb-6">{feat.title}</h3>
                  <ul className="space-y-3">
                    {feat.items.map((item, i) => (
                      <li key={i} className="flex items-start text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SHOWCASE ALTERNATING */}
        <section className="py-24 bg-zinc-950/50 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
            {data.showcase.map((block, idx) => (
              <div key={idx} className={`flex flex-col ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-4">{block.title}</h2>
                  <p className="text-xl text-gray-400 leading-relaxed">{block.desc}</p>
                </div>
                <div className="flex-1 w-full bg-zinc-900 h-64 rounded-2xl border border-zinc-800 flex items-center justify-center text-zinc-700 font-bold text-xl shadow-xl">
                  [ UI Mockup: {block.imageType} ]
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TEMPLATE SEO SECTION */}
        <section className="py-24 border-t border-zinc-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-6">{data.template.title}</h2>
            <p className="text-gray-400 mb-10 text-lg">Stop using generic word documents. Our built-in templates handle everything.</p>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl text-left border border-gray-200 max-w-2xl mx-auto">
              <div className="bg-zinc-100 p-6 border-b border-gray-200 flex justify-between items-center">
                <div className="font-black text-2xl text-zinc-800">YOUR LOGO</div>
                <div className="text-zinc-500 text-sm text-right">Quote Date: {new Date().toLocaleDateString()}</div>
              </div>
              <div className="p-8">
                <h3 className="text-lg font-bold text-zinc-900 mb-4 uppercase">{data.template.title}</h3>
                <table className="w-full text-sm mb-8">
                  <thead className="border-b-2 border-zinc-200">
                    <tr><th className="text-left pb-2">Description</th><th className="text-right pb-2">Amount</th></tr>
                  </thead>
                  <tbody>
                    {data.template.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-zinc-100">
                        <td className="py-3 text-zinc-700">{item}</td>
                        <td className="py-3 text-right text-zinc-900 font-medium">---</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button className="mt-10 inline-flex items-center px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors">
              <Download className="w-5 h-5 mr-2" /> Download Sample PDF
            </button>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-zinc-950/50 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center text-yellow-400 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
            </div>
            {data.testimonials.map((test, idx) => (
              <div key={idx} className="max-w-3xl mx-auto">
                <p className="text-2xl text-white italic mb-6 leading-relaxed">"{test.quote}"</p>
                <div className="text-gray-400 font-medium">— {test.author}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 border-t border-zinc-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {data.faqs.map((faq, idx) => (
                <FAQItem key={idx} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-24 bg-blue-900/20 border-t border-blue-900/30 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-white mb-6">{data.cta.headline}</h2>
            <p className="text-xl text-blue-100 mb-10">{data.cta.subheadline}</p>
            <Link to="/register" className="inline-block px-10 py-5 bg-white text-blue-900 font-bold text-lg rounded-xl hover:bg-gray-100 shadow-2xl transition-all">
              Start Your Free Trial
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-zinc-800 bg-zinc-900/30 rounded-xl overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-5 flex justify-between items-center text-left">
        <span className="text-lg font-medium text-white">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
      </button>
      <div className={`px-6 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-400">{answer}</p>
      </div>
    </div>
  );
}
