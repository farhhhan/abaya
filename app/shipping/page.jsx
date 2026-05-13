"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { assets } from "@/assets/assets";

const ShippingPolicy = () => {
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
              src={assets.shipping_luxury_abaya.src}
              alt="Premium Shipping"
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
                Worldwide Delivery
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white uppercase tracking-widest leading-tight">
                Shipping Policy
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
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">1. Processing Times</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              All our abayas are meticulously crafted and prepared for shipment. Please allow 2-4 business days for order processing before your package is dispatched. During peak seasons or exclusive launches, processing may take up to 7 business days. You will receive a confirmation email once your order has been shipped.
            </p>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">2. Domestic Shipping (UAE)</h2>
            <p className="text-gray-500 font-light leading-relaxed mb-4">
              We offer premium delivery services across the United Arab Emirates to ensure your garments arrive in perfect condition.
            </p>
            <ul className="list-disc list-inside text-gray-500 font-light leading-relaxed space-y-2">
              <li>Standard Delivery (1-2 Business Days): AED 25</li>
              <li>Next Day Delivery (Order before 2 PM): AED 40</li>
              <li>Complimentary standard shipping on orders over AED 500</li>
            </ul>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">3. International Shipping</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              We proudly ship worldwide via trusted courier partners (DHL/FedEx). International delivery times typically range from 3-7 business days depending on the destination. Shipping rates are calculated at checkout based on location and package weight.
            </p>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">4. Customs, Duties & Taxes</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              Please note that international orders may be subject to import duties and taxes upon arrival in the destination country. These charges are the sole responsibility of the customer. SO ABAYAS has no control over these charges and cannot predict what they may be.
            </p>
          </motion.section>

          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-xl font-heading uppercase tracking-widest mb-4">5. Tracking Your Order</h2>
            <p className="text-gray-500 font-light leading-relaxed">
              Once your order has been dispatched, you will receive an email containing your tracking number and a link to monitor your shipment's progress. For any tracking inquiries, our concierge team is always available to assist you.
            </p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingPolicy;
