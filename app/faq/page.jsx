"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "@/assets/assets";
import Link from "next/link";

const faqs = [
  {
    question: "How do I know which size to choose?",
    answer: "Our abayas are designed to offer a modest, flowing fit. Please refer to our Size Guide, which details specific measurements for length and width. If you are between sizes, we generally recommend sizing up for a more relaxed drape."
  },
  {
    question: "Can I customize the length of my abaya?",
    answer: "Yes, we offer complimentary length adjustments on select premium pieces. Please leave a note with your desired length (in inches) during checkout. Note that customized items are final sale and cannot be returned."
  },
  {
    question: "What is the best way to care for my abaya?",
    answer: "To maintain the pristine condition of your garment, we highly recommend dry cleaning. If you choose to hand wash, use cold water and a gentle detergent. Never wring the fabric, and always steam rather than iron."
  },
  {
    question: "Do you ship internationally?",
    answer: "Absolutely. We ship worldwide using trusted premium couriers like DHL and FedEx. International delivery typically takes 3-7 business days."
  },
  {
    question: "What if an item is out of stock?",
    answer: "Our collections are often limited edition to maintain exclusivity. However, core pieces may be restocked. You can sign up for 'Back in Stock' notifications on the product page or contact our concierge for bespoke order possibilities."
  }
];

const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-b border-gray-200"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
      >
        <h3 className="text-lg font-heading uppercase tracking-widest text-[#121212] group-hover:text-[#A38A6F] transition-colors pr-8">
          {faq.question}
        </h3>
        <div className="text-[#A38A6F] flex-shrink-0 relative w-4 h-4">
          <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          </span>
          <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
          </span>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-500 font-light leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-body text-[#121212]">
      <Navbar />

      <main className="pt-10 pb-32">
        {/* Editorial Hero Section */}
        <section className="px-6 md:px-16 lg:px-32 mb-24">
          <div className="relative w-full h-[50vh] rounded-none md:rounded-2xl overflow-hidden group">
            <img
              src={assets.faq_luxury_abaya.src}
              alt="Concierge Services"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <p className="text-[10px] md:text-xs text-[#A38A6F] font-black tracking-[0.4em] uppercase mb-4">
                We're Here to Help
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white uppercase tracking-widest leading-tight">
                FAQ
              </h1>
            </motion.div>
          </div>
        </section>

        <div className="px-6 md:px-16 lg:px-32 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>

        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-[#FAFAF9] p-12 text-center rounded-sm"
        >
          <h2 className="text-2xl font-heading uppercase tracking-widest mb-4">Still have questions?</h2>
          <p className="text-gray-500 font-light leading-relaxed mb-8 max-w-lg mx-auto">
            Our concierge team is available to assist you with any bespoke inquiries or further information you may require.
          </p>
          <Link 
            href="/contact"
            className="inline-block px-10 py-4 bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#A38A6F] transition-colors duration-300"
          >
            Contact Us
          </Link>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;
