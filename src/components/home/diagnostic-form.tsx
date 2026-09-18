"use client";

import { useState } from "react";

export function DiagnosticForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="diagnostic-form" className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6 md:px-12">
        <div className="bg-white border border-stone-200 p-8 md:p-12 rounded-2xl shadow-sm relative overflow-hidden">
          <h2 className="text-3xl font-bold text-center mb-3" style={{ color: "#1C1917" }}>
            Request a Strategic GTM Diagnostic
          </h2>
          <p className="text-center text-sm mb-8 leading-relaxed" style={{ color: "#57534E" }}>
            A 45-minute architectural review with our senior partners. We will analyze your positioning, CAC efficiency, and pipeline leaks—and deliver actionable takeaways.
          </p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0" }}>
                <svg className="w-8 h-8" style={{ color: "#059669" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#1C1917" }}>Request Received</h3>
              <p className="text-sm" style={{ color: "#57534E" }}>Our senior partners will review your submission and reach out within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors"
                  style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF5500")}
                  onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
                />
                <input
                  type="text"
                  placeholder="company.com"
                  className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors"
                  style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF5500")}
                  onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors appearance-none"
                  style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                  defaultValue=""
                >
                  <option value="" disabled>Annual Revenue Bracket</option>
                  <option value="lt5">&lt;$5M ARR</option>
                  <option value="5-20">$5M–$20M ARR</option>
                  <option value="20-50">$20M–$50M ARR</option>
                  <option value="50+">$50M+ ARR</option>
                </select>
                <select
                  className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors appearance-none"
                  style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                  defaultValue=""
                >
                  <option value="" disabled>Primary GTM Bottleneck</option>
                  <option value="positioning">Enterprise Positioning &amp; Messaging</option>
                  <option value="pipeline">Pipeline Velocity &amp; Sales Drag</option>
                  <option value="demand">Demand Generation / ABM</option>
                  <option value="overhaul">Full GTM System Overhaul</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[#FF5500] hover:bg-[#E04B00] text-white font-semibold py-4 rounded-lg text-base transition-all shadow-lg mt-4"
              >
                Schedule Strategic Diagnostic →
              </button>
              <p className="text-center text-xs mt-4" style={{ color: "#A8A29E" }}>
                Confidential executive consultation. Direct access to senior strategists—no junior sales reps.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
