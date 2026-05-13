"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { assets } from "@/assets/assets";
import Link from "next/link";

const ReturnsPolicy = () => {
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
              src={assets.returns_luxury_abaya.src}
              alt="Premium Returns"
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
                Hassle-Free Returns
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white uppercase tracking-widest leading-tight">
                Returns & Exchanges
              </h1>
            </motion.div>
          </div>
        </section>

        <div className="px-6 md:px-16 lg:px-32 max-w-5xl mx-auto space-y-16">
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">1. Our Commitment</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              At SO ABAYAS, we strive for perfection in every stitch. If your purchase does not completely satisfy you, we are here to assist. We accept returns and exchanges within 14 days of the delivery date, provided the items meet our return conditions.
            </p>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">2. Conditions for Return</h2>
            <p className="text-gray-500 font-light leading-relaxed mb-4">
              To be eligible for a return or exchange, your item must meet the following criteria:
            </p>
            <ul className="list-disc list-inside text-gray-500 font-light leading-relaxed space-y-2">
              <li>The item must be unworn, unwashed, and in its original condition.</li>
              <li>All original tags and labels must remain attached.</li>
              <li>The item must be returned in its original, undamaged packaging.</li>
              <li>Scented items (perfume, oud, smoke) will not be accepted.</li>
            </ul>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">3. Non-Refundable Items</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              For hygiene and bespoke reasons, the following items cannot be returned or exchanged: bespoke/customized abayas, intimate innerwear, hijabs (if removed from protective packaging), and sale items marked as final sale.
            </p>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">4. The Process</h2>
            <p className="text-gray-500 font-light leading-relaxed mb-4">
              To initiate a return or exchange, please follow these steps:
            </p>
            <ol className="list-decimal list-inside text-gray-500 font-light leading-relaxed space-y-2">
              <li>Contact our concierge team at <a href="mailto:concierge@abaya.com" className="text-black hover:text-[#A38A6F] transition-colors">concierge@abaya.com</a> with your order number.</li>
              <li>Our team will provide you with a Return Authorization Number (RAN) and instructions.</li>
              <li>Securely pack the item and arrange for shipping back to our boutique.</li>
              <li>Once received and inspected, your refund or exchange will be processed within 5-7 business days.</li>
            </ol>
            <p className="text-gray-500 font-light leading-relaxed mt-4">
              Please note that return shipping costs are the responsibility of the customer unless the item received was damaged or incorrect.
            </p>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="pt-8 border-t border-gray-100 text-center"
          >
            <p className="text-gray-500 font-light leading-relaxed mb-6">
              Need assistance with a return?
            </p>
            <Link 
              href="/contact"
              className="inline-block px-10 py-4 bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#A38A6F] transition-colors duration-300"
            >
              Contact Concierge
            </Link>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReturnsPolicy;
