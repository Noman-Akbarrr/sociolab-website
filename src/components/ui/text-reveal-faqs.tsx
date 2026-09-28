'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { motion } from "framer-motion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQs() {
  const faqItems = [
    {
      id: 'item-1',
      question: 'What services does Sociolab offer?',
      answer: 'Sociolab offers three core services: Performance Marketing (Meta, Google, TikTok ads), Social Media Management (content, community, creators), and Web Development (Next.js, Shopify, Framer, WordPress).',
    },
    {
      id: 'item-2',
      question: 'What is your minimum engagement?',
      answer: 'Monthly retainers start at PKR 200K/month. Project-based work available for web development. No long-term contracts — 30-day notice to pause or cancel.',
    },
    {
      id: 'item-3',
      question: 'How do you handle iOS 14+ tracking?',
      answer: 'We implement server-side Meta CAPI and Google Enhanced Conversions alongside pixel tracking, restoring 60-80% of signal lost from iOS privacy updates.',
    },
    {
      id: 'item-4',
      question: 'What is your creative testing process?',
      answer: 'Dynamic Creative Testing (DCT) matrices with 8-12 variations per ad set. We test hooks, formats, angles weekly and reallocate budget to winners.',
    },
    {
      id: 'item-5',
      question: 'How do you communicate and report?',
      answer: 'Weekly Slack/email updates, monthly performance calls, real-time dashboard access, quarterly strategy reviews. Direct access to your account lead.',
    },
    {
      id: 'item-6',
      question: 'How fast can we start?',
      answer: 'Typically 1-2 weeks after signed agreement. Week 1: audit & setup, then creative production, then launch.',
    },
  ];

  return (
    <section className="py-12 md:py-20" style={{ backgroundColor: "#F5F5F4" }}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          <div className="md:col-span-2">
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#1C1917" }}>
              FAQs
            </h2>
            <p className="mt-4 text-lg" style={{ color: "#57534E" }}>
              Everything you need to know about working with Sociolab
            </p>
            <p className="mt-6 hidden md:block" style={{ color: "#78716C" }}>
              Can't find what you're looking for? Reach out to our{' '}
              <Link
                href="/contact"
                className="text-[#FF5500] font-medium hover:underline"
              >
                Sociolab support team
              </Link>{' '}
              for assistance.
            </p>
          </div>

          <div className="md:col-span-3">
            <Accordion
              type="single"
              collapsible>
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-b border-stone-200">
                  <AccordionTrigger className="cursor-pointer text-base font-medium hover:no-underline py-4">{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <BlurredStagger text={item.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <p className="mt-6 md:hidden" style={{ color: "#78716C" }}>
            Can't find what you're looking for? Contact our{' '}
            <Link
              href="/contact"
              className="text-[#FF5500] font-medium hover:underline">
              customer support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export const BlurredStagger = ({
  text = "built by Sociolab",
}: {
  text: string;
}) => {
  const headingText = text;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015,
      },
    },
  };

  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <>
      <div className="w-full">
        <motion.p
          variants={container}
          initial="hidden"
          animate="show"
          className="text-base leading-relaxed break-words whitespace-normal"
        >
          {headingText.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterAnimation}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </>
  );
};