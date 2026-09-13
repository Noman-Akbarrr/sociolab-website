"use client";

import { useState } from "react";

export function DiagnosticForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="diagnostic-form" className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6 md:px-12">
        <div className="bg-[#12151C] border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-blue-400 mb-3">
            [ Direct Executive Access ]
          </p>
          <h2 className="text-3xl font-bold text-white text-center mb-3">
            Request a Strategic GTM Diagnostic
          </h2>
          <p className="text-center text-slate-400 text-sm mb-8 leading-relaxed">
            A 45-minute architectural review with our senior partners. We will analyze your positioning, CAC efficiency, and pipeline leaks—and deliver actionable takeaways.
          </p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Request Received</h3>
              <p className="text-sm text-slate-400">Our senior partners will review your submission and reach out within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="bg-[#0B0D11] border border-white/15 focus:border-blue-500 text-white text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors"
                />
                <input
                  type="text"
                  placeholder="company.com"
                  className="bg-[#0B0D11] border border-white/15 focus:border-blue-500 text-white text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="bg-[#0B0D11] border border-white/15 focus:border-blue-500 text-white text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors appearance-none"
                  defaultValue=""
                >
                  <option value="" disabled className="text-slate-500">Annual Revenue Bracket</option>
                  <option value="lt5">&lt;$5M ARR</option>
                  <option value="5-20">$5M–$20M ARR</option>
                  <option value="20-50">$20M–$50M ARR</option>
                  <option value="50+">$50M+ ARR</option>
                </select>
                <select
                  className="bg-[#0B0D11] border border-white/15 focus:border-blue-500 text-white text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors appearance-none"
                  defaultValue=""
                >
                  <option value="" disabled className="text-slate-500">Primary GTM Bottleneck</option>
                  <option value="positioning">Enterprise Positioning &amp; Messaging</option>
                  <option value="pipeline">Pipeline Velocity &amp; Sales Drag</option>
                  <option value="demand">Demand Generation / ABM</option>
                  <option value="overhaul">Full GTM System Overhaul</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-lg text-base transition-all shadow-lg hover:shadow-blue-500/25 mt-4"
              >
                Schedule Strategic Diagnostic →
              </button>
              <p className="text-center text-xs text-slate-500 mt-4">
                Confidential executive consultation. Direct access to senior strategists—no junior sales reps.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
