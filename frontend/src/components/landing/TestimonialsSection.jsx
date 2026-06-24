import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "James Njoroge",
    role: "Master Electrician",
    quote: "QuickQuote Pro has completely transformed my business. I used to spend my evenings doing paperwork. Now, I generate quotes on my phone before I even leave the client's site. My approval rate went up by 40%!",
    initials: "JN",
    color: "bg-yellow-500"
  },
  {
    name: "David Ochieng",
    role: "Professional Plumber",
    quote: "The M-Pesa integration is a lifesaver. Once a client approves the quote, it turns into an invoice, and they pay immediately. No more chasing down payments at the end of the month.",
    initials: "DO",
    color: "bg-blue-500"
  },
  {
    name: "Sarah Wanjiku",
    role: "Solar Installation Expert",
    quote: "Solar quotes can get very complex with all the parts and labor. QuickQuote Pro's templates let me pull up my standard kits in seconds. The PDFs look incredibly professional.",
    initials: "SW",
    color: "bg-orange-500"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-transparent relative z-20 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Don't Just Take Our Word For It</h2>
          <p className="mt-4 text-xl text-gray-400">Join hundreds of contractors saving time and making more money.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 relative">
              <div className="flex text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-8 relative z-10 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {testimonial.initials}
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
