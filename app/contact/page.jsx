"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const ContactPage = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: '+1-234-567-890',
    email: 'concierge@abaya.com',
    address: '123 Fashion Avenue\nDubai, UAE',
    hoursWeekday: 'Mon–Fri, 9am–6pm',
    hoursSaturday: 'Sat: 10:00 AM–4:00 PM',
    hoursSunday: 'Sun: Closed'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const docRef = doc(db, "settings", "contact_info");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setContactInfo({
          phone: data.phone || '+1-234-567-890',
          email: data.email || 'concierge@abaya.com',
          address: data.address || '123 Fashion Avenue\nDubai, UAE',
          hoursWeekday: data.hoursWeekday || 'Mon–Fri, 9am–6pm',
          hoursSaturday: data.hoursSaturday || 'Sat: 10:00 AM–4:00 PM',
          hoursSunday: data.hoursSunday || 'Sun: Closed'
        });
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-body text-[#121212]">
      <Navbar />

      <main className="pt-10 pb-20">
        {/* Editorial Hero Section */}
        <section className="px-6 md:px-16 lg:px-32 mb-24">
          <div className="relative w-full h-[50vh] rounded-none md:rounded-2xl overflow-hidden group">
            <Image
              src={assets.new_abaya_hero_1}
              alt="Contact Our Boutique"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-[2s]"
              priority
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <p className="text-[10px] md:text-xs text-[#A38A6F] font-black tracking-[0.4em] uppercase mb-4">
                We're Here For You
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white uppercase tracking-widest leading-tight">
                Get In Touch
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Contact Details & Map - Luxury Layout */}
        <section className="px-6 md:px-16 lg:px-32 py-12 max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Left: Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/3 space-y-12"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-heading uppercase tracking-widest mb-2">Connect</h2>
                <div className="w-10 h-[1px] bg-[#A38A6F] mb-8"></div>
                <p className="text-gray-500 font-light leading-relaxed mb-10">
                  Whether you seek styling advice, have questions regarding an order, or wish to inquire about bespoke tailoring, our dedicated concierge team is at your service.
                </p>
              </div>

              <div className="space-y-8">
                {/* Phone */}
                <div className="group border-l border-gray-200 pl-6 hover:border-[#A38A6F] transition-colors duration-500">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A38A6F] mb-2">Telephone</h3>
                  <a href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, '')}`} className="text-xl font-heading tracking-wider hover:opacity-70 transition-opacity">
                    {contactInfo.phone}
                  </a>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{contactInfo.hoursWeekday}</p>
                </div>

                {/* Email */}
                <div className="group border-l border-gray-200 pl-6 hover:border-[#A38A6F] transition-colors duration-500">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A38A6F] mb-2">Email Inquiries</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-lg font-light hover:text-[#A38A6F] transition-colors">
                    {contactInfo.email}
                  </a>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Responses within 24H</p>
                </div>

                {/* Address */}
                <div className="group border-l border-gray-200 pl-6 hover:border-[#A38A6F] transition-colors duration-500">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A38A6F] mb-2">The Boutique</h3>
                  <p className="text-lg font-light leading-relaxed whitespace-pre-line">
                    {contactInfo.address}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Visits by appointment</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Map */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-2/3 h-[500px] lg:h-auto min-h-[500px] relative rounded-none md:rounded-2xl overflow-hidden group shadow-2xl"
            >
              <iframe
                title="Boutique Location"
                src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${encodeURIComponent(contactInfo.address.replace(/\n/g, ' '))}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
                className="absolute inset-0 w-full h-full grayscale-[100%] contrast-[1.1] opacity-90 group-hover:grayscale-[50%] transition-all duration-1000"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-none md:rounded-2xl"></div>
            </motion.div>
          </div>
        </section>

        {/* Minimalist Contact CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-6 md:px-16 lg:px-32 py-24 text-center max-w-4xl mx-auto"
        >
          <div className="w-12 h-[1px] bg-[#A38A6F] mx-auto mb-8"></div>
          <h2 className="text-3xl md:text-4xl font-heading uppercase tracking-widest mb-6">
            Prefer to write us?
          </h2>
          <p className="text-gray-500 font-light text-lg mb-10 leading-relaxed">
            Send us a direct message regarding your tailoring needs, and our styling team will curate a personalized response tailored exactly to your vision.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-block px-10 py-4 bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#A38A6F] transition-colors duration-300"
            >
              Send an Email
            </a>
            <Link 
              href="/my-orders" 
              className="inline-block px-10 py-4 border border-black text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-white transition-colors duration-300"
            >
              Track Orders
            </Link>
          </div>
        </motion.section>



      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
