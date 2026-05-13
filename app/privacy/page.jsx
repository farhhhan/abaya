"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { assets } from "@/assets/assets";

const PrivacyPolicy = () => {
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
              src={assets.privacy_luxury_abaya.src}
              alt="Data Privacy"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <p className="text-[10px] md:text-xs text-[#A38A6F] font-black tracking-[0.4em] uppercase mb-4">
                Secure & Confidential
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white uppercase tracking-widest leading-tight">
                Privacy Policy
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
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">1. Data Collection</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              SO ABAYAS respecst your privacy. When you visit our boutique online, register for an account, or place an order, we collect specific personal information such as your name, email address, shipping address, and payment details. This information is strictly used to process your orders and provide a tailored shopping experience.
            </p>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">2. Use of Information</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              The data we collect allows us to manage your purchases, provide customer support, and, with your consent, send you exclusive updates regarding new collections, bespoke services, and private sales. We never sell your personal information to third parties.
            </p>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">3. Security</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              We employ industry-leading encryption technologies and strict security protocols to safeguard your personal and payment data. Our checkout process is fully secured, ensuring that your confidential information remains protected at all times.
            </p>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">4. Cookies</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              Our website utilizes cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You have the option to accept or decline cookies through your browser settings, though declining may limit your access to certain features of our boutique.
            </p>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">5. Contact Us</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              If you have any questions or concerns regarding our privacy practices, or if you wish to update or delete your personal information, please contact our concierge team at <a href="mailto:privacy@abaya.com" className="text-black hover:text-[#A38A6F] transition-colors">privacy@abaya.com</a>.
            </p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
