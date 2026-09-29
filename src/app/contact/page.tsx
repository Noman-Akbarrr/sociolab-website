"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    whatsapp: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("/api/contact/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit form");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", company: "", whatsapp: "", service: "", message: "" });
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "Failed to submit form. Please try again." });
    }
  };

  return (
    <main style={{ backgroundColor: "#FAFAF9" }} className="min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "#F5F5F4" }}>
          <div className="absolute top-[15%] left-[12%] w-2 h-2 rounded-full bg-[#FF5500] opacity-10" />
          <div className="absolute top-[35%] right-[15%] w-3 h-3 rounded-full bg-[#FF5500] opacity-[0.07]" />
          <div className="absolute top-[60%] left-[20%] w-1.5 h-1.5 rounded-full bg-[#FF5500] opacity-15" />
        </div>

        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#FF5500" }}>
                Get in Touch
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.08] tracking-tight mt-3 mb-6" style={{ color: "#1C1917" }}>
                Let&apos;s Build Something Great
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: "#57534E" }}>
                Ready to grow? Tell us about your business and we&apos;ll get back within 24 hours with a free audit.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── Contact Form ─────────────────────────────── */}
      <section className="py-8 md:py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-stone-200 p-8 md:p-12 rounded-2xl shadow-sm">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0" }}>
                    <svg className="w-8 h-8" style={{ color: "#059669" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: "#1C1917" }}>Message Sent</h3>
                  <p className="text-base mb-6" style={{ color: "#57534E" }}>
                    Thanks for reaching out! We&apos;ll review your message and get back within 24 hours with a free audit.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", company: "", whatsapp: "", service: "", message: "" });
                    }}
                    className="inline-flex items-center gap-2 bg-[#FF5500] hover:bg-[#E04B00] text-white font-semibold px-6 py-3 rounded-lg transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.form && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm mb-4">
                      {errors.form}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: "#1C1917" }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors"
                        style={{ 
                          backgroundColor: "#F5F5F4", 
                          border: `1px solid ${errors.name ? "#FF5500" : "#E7E5E4"}`, 
                          color: "#1C1917" 
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#FF5500"}
                        onBlur={(e) => e.target.style.borderColor = errors.name ? "#FF5500" : "#E7E5E4"}
                      />
                      {errors.name && <p className="text-xs mt-1" style={{ color: "#FF5500" }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: "#1C1917" }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors"
                        style={{ 
                          backgroundColor: "#F5F5F4", 
                          border: `1px solid ${errors.email ? "#FF5500" : "#E7E5E4"}`, 
                          color: "#1C1917" 
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#FF5500"}
                        onBlur={(e) => e.target.style.borderColor = errors.email ? "#FF5500" : "#E7E5E4"}
                      />
                      {errors.email && <p className="text-xs mt-1" style={{ color: "#FF5500" }}>{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-1" style={{ color: "#1C1917" }}>
                        Company / Website
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="company.com"
                        className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors"
                        style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                        onFocus={(e) => e.target.style.borderColor = "#FF5500"}
                        onBlur={(e) => e.target.style.borderColor = "#E7E5E4"}
                      />
                    </div>
                    <div>
                      <label htmlFor="whatsapp" className="block text-sm font-medium mb-1" style={{ color: "#1C1917" }}>
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                        className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors"
                        style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                        onFocus={(e) => e.target.style.borderColor = "#FF5500"}
                        onBlur={(e) => e.target.style.borderColor = "#E7E5E4"}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium mb-1" style={{ color: "#1C1917" }}>
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors appearance-none"
                      style={{ backgroundColor: "#F5F5F4", border: "1px solid #E7E5E4", color: "#1C1917" }}
                    >
                      <option value="">Select a service</option>
                      <option value="performance">Performance Marketing</option>
                      <option value="social">Social Media Management</option>
                      <option value="web">Web Development</option>
                      <option value="all">All of the Above</option>
                      <option value="other">Other / Not Sure</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1" style={{ color: "#1C1917" }}>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="text-sm rounded-lg px-4 py-3 outline-none w-full transition-colors resize-none"
                      style={{ 
                        backgroundColor: "#F5F5F4", 
                        border: `1px solid ${errors.message ? "#FF5500" : "#E7E5E4"}`, 
                        color: "#1C1917" 
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#FF5500"}
                      onBlur={(e) => e.target.style.borderColor = errors.message ? "#FF5500" : "#E7E5E4"}
                      placeholder="Tell us about your business, goals, and challenges..."
                    />
                    {errors.message && <p className="text-xs mt-1" style={{ color: "#FF5500" }}>{errors.message}</p>}
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-[#FF5500] hover:bg-[#E04B00] text-white font-semibold py-4 rounded-lg text-base transition-all shadow-lg"
                  >
                    Get My Free Audit
                  </button>
                  <p className="text-center text-xs" style={{ color: "#A8A29E" }}>
                    No spam. Just a free audit with actionable recommendations.
                  </p>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Direct Contact Info ─────────────────────────── */}
      <section className="py-8 md:py-16" style={{ backgroundColor: "#F5F5F4" }}>
        <Container>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-center p-6 rounded-xl bg-white border border-stone-200"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#FF5500" }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#1C1917" }}>Email Us</h3>
              <a href={`mailto:${site.email}`} className="text-sm transition-colors hover:text-[#FF5500]" style={{ color: "#57534E" }}>
                {site.email}
              </a>
              <p className="text-xs mt-2" style={{ color: "#A8A29E" }}>Replies within 1 business day</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-center p-6 rounded-xl bg-white border border-stone-200"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#FF5500" }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A2.5 2.5 0 0112 21a2.5 2.5 0 01-5.657-5.657L18.293 4.293A2.5 2.5 0 0121 6.293l-7 7a2.5 2.5 0 01-3.536 0L4.707 7.707a2.5 2.5 0 010-3.536l7-7A2.5 2.5 0 0112 1.343a2.5 2.5 0 013.536 3.536l7 7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#1C1917" }}>Office</h3>
              <p className="text-sm" style={{ color: "#57534E" }}>Islamabad / Rawalpindi, Pakistan</p>
              <p className="text-xs mt-1" style={{ color: "#A8A29E" }}>Serving Regional & Global Clients</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-center p-6 rounded-xl bg-white border border-stone-200"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#FF5500" }}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.25 6.75c0 8.284-6.716 15-15 15-2.12 0-4.107-.577-5.772-1.58-.37-.198-.77-.27-1.178-.158a.75.75 0 01-.524-.931c.455-.455 1.129-.406 1.498-.07a17.079 17.079 0 006.426 6.426c.339.369.389.1002.07-.524a.75.75 0 01-.158-1.178c-.092-.202-.261-.389-.58-.577A14.983 14.983 0 016 8.25c0-8.284 6.716-15 15-15 2.636 0 5.054.77 7.113 2.121a.75.75 0 01.12.532c-.16.28-.23.601-.18.92-.395 2.413-.6 4.88-.6 7.378z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#1C1917" }}>WhatsApp</h3>
              <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="text-sm transition-colors hover:text-[#FF5500]" style={{ color: "#57534E" }}>
                +92 300 1234567
              </a>
              <p className="text-xs mt-1" style={{ color: "#A8A29E" }}>Direct chat for quick questions</p>
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  );
}