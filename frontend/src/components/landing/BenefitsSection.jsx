import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const comparisonData = [
  { feature: "Time to create a quote", traditional: "30-60 minutes", qqp: "Under 2 minutes" },
  { feature: "Professional Branded PDFs", traditional: "Manual (Word/Excel)", qqp: "Automatic" },
  { feature: "Quote tracking (Viewed/Opened)", traditional: "Guesswork", qqp: "Instant Alerts" },
  { feature: "Client Approvals", traditional: "Back-and-forth emails", qqp: "One-click online approval" },
  { feature: "Payment Collection", traditional: "Manual bank transfers", qqp: "Integrated M-Pesa STK Push" },
  { feature: "Follow-up Reminders", traditional: "Manual calendar alerts", qqp: "Automated SMS/Email" }
];

export function BenefitsSection() {
  return (
    <section className="py-24 bg-transparent relative z-20 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Why Switch to QuickQuote Pro?</h2>
          <p className="mt-4 text-xl text-gray-400">Stop fighting with Word documents and Excel spreadsheets.</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="w-1/3 p-6 text-lg font-semibold text-white border-b border-zinc-800 bg-zinc-900/80">Feature</th>
                <th className="w-1/3 p-6 text-lg font-semibold text-zinc-400 border-b border-zinc-800 bg-zinc-900/80 text-center">Traditional Method</th>
                <th className="w-1/3 p-6 text-lg font-bold text-blue-400 border-b border-zinc-800 bg-blue-900/10 text-center border-l border-zinc-800">QuickQuote Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {comparisonData.map((row, index) => (
                <tr key={index} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-6 font-medium text-white">{row.feature}</td>
                  <td className="p-6 text-center text-zinc-400 flex flex-col items-center justify-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500/70" />
                    <span className="text-sm">{row.traditional}</span>
                  </td>
                  <td className="p-6 text-center text-blue-100 bg-blue-900/5 border-l border-zinc-800 flex flex-col items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-semibold">{row.qqp}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
