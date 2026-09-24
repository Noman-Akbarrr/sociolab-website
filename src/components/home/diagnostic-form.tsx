"use client";

import { useState } from "react";

export function DiagnosticForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="diagnostic-form" className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6 md:px-12">
        <div className="bg-white border border-stone-200 p-8 md:p-12 rounded-2xl shadow-sm relative overflow-hidden">
          <h2 className="text-3xl font-bold text-center mb-3" style={{ color: "#1C1917" }}>
            Get Your Free Growth Audit
          </h2>
          <p className="text-center text-sm mb-8 leading-relaxed" style={{ color: "#57534E" }}>
            Tell us about your business and we&apos;ll send you a free audit with actionable recommendations to grow online.
          </p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0" }}>
                <i className="bx bx-check text-3xl" style={{ color: "#059669" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#1C1917" }}>Request Received!</h3>
              <p className="text-sm" style={{ color: "#57534E" }}>We&apos;ll review your submission and reach out within 24 hours with your free audit.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors"
                  style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF5500")}
                  onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors"
                  style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                  onFocus={(e) => (e.target.style.borderColor = "#FF5500")}
                  onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number (optional)"
                className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors"
                style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                onFocus={(e) => (e.target.style.borderColor = "#FF5500")}
                onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors appearance-none"
                  style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                  defaultValue=""
                >
                  <option value="" disabled>Business Type</option>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="local">Local Business</option>
                  <option value="startup">Startup</option>
                  <option value="saas">SaaS</option>
                  <option value="other">Other</option>
                </select>
                <select
                  className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors appearance-none"
                  style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                  defaultValue=""
                >
                  <option value="" disabled>What do you need?</option>
                  <option value="performance">Performance Marketing</option>
                  <option value="social">Social Media Management</option>
                  <option value="web">Web Development</option>
                  <option value="all">All of the Above</option>
                </select>
              </div>
              <select
                className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors appearance-none"
                style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                defaultValue=""
              >
                <option value="" disabled>Monthly Budget Range</option>
                <option value="under50k">Under PKR 50,000</option>
                <option value="50-100k">PKR 50,000 - 100,000</option>
                <option value="100-250k">PKR 100,000 - 250,000</option>
                <option value="250k+">PKR 250,000+</option>
              </select>
              <button
                type="submit"
                className="w-full bg-[#FF5500] hover:bg-[#E04B00] text-white font-semibold py-4 rounded-lg text-base transition-all shadow-lg mt-4"
              >
                Get My Free Audit
              </button>
              <p className="text-center text-xs mt-4" style={{ color: "#A8A29E" }}>
                No spam. Just a free audit with actionable recommendations.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
