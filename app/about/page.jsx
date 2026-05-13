"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const AboutPage = () => {
  // Force scroll to top on mount to fix navigation issues
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-body text-[#121212]">
      <Navbar />

      <main className="pt-10 pb-20">
        {/* Editorial Hero Section */}
        <section className="px-6 md:px-16 lg:px-32 mb-24">
          <div className="relative w-full h-[70vh] rounded-none md:rounded-2xl overflow-hidden group">
            <Image
              src={assets.new_abaya_hero_2}
              alt="Luxury Abaya Collection"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-[2s]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col items-center text-center"
            >
              <p className="text-[10px] md:text-xs text-[#A38A6F] font-black tracking-[0.4em] uppercase mb-4">
                Est. 2010
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white uppercase tracking-widest leading-tight">
                Crafting <br className="md:hidden" /> Timeless <br className="hidden md:block" /> Elegance
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Brand Philosophy - Magazine Layout */}
        <section className="px-6 md:px-16 lg:px-32 py-16 bg-[#FAFAF9]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[#A38A6F]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A38A6F]">Our Philosophy</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading uppercase tracking-widest text-[#121212] leading-snug">
                Modesty Meets Haute Couture
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                Our journey began with a simple belief: modesty and elegance go hand in hand. We sought to redefine the traditional abaya by blending it with contemporary fashion sensibilities, creating pieces that empower women to feel both deeply connected to their roots and effortlessly chic.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed font-light">
                Every silhouette is meticulously designed in our studio, where we partner with master artisans to bring our visions to life. From flowing silks to intricate lace detailing, we ensure that every garment reflects our unwavering commitment to quality and luxury.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative w-full aspect-[4/5]"
            >
              <Image
                src={assets.timeless_elegance_abaya}
                alt="Intricate Detailing"
                fill
                className="object-cover shadow-2xl"
              />
              {/* Decorative Frame */}
              <div className="absolute -inset-4 border border-[#A38A6F]/30 -z-10 hidden md:block"></div>
            </motion.div>
          </div>
        </section>

        {/* Pillars of Excellence */}
        <section className="px-6 md:px-16 lg:px-32 py-24">
          <div className="text-center mb-16 space-y-4 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A38A6F]">The Standards</span>
            <h2 className="text-3xl md:text-5xl font-heading tracking-widest uppercase">Pillars of Excellence</h2>
            <div className="w-12 h-[1px] bg-black mt-4"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Pillar 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group border border-gray-100 p-10 hover:border-[#A38A6F]/50 transition-colors duration-500 bg-white"
            >
              <div className="text-[#A38A6F] mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <h3 className="text-xl font-heading uppercase tracking-widest mb-4">Premium Fabrics</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                We source only the finest materials from around the globe. Breathable nida, luxurious silks, and rich crepe ensure a drape that is as comfortable as it is stunning.
              </p>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group border border-gray-100 p-10 hover:border-[#A38A6F]/50 transition-colors duration-500 bg-white"
            >
              <div className="text-[#A38A6F] mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
              </div>
              <h3 className="text-xl font-heading uppercase tracking-widest mb-4">Ethical Craftsmanship</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                Every piece is hand-finished in our dedicated ateliers. We believe in fair wages, ethical sourcing, and a sustainable approach to slow fashion that respects both people and planet.
              </p>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group border border-gray-100 p-10 hover:border-[#A38A6F]/50 transition-colors duration-500 bg-white"
            >
              <div className="text-[#A38A6F] mb-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
              </div>
              <h3 className="text-xl font-heading uppercase tracking-widest mb-4">Exquisite Detailing</h3>
              <p className="text-gray-500 font-light leading-relaxed">
                From delicate hand-sewn beadwork to precise tailoring, it is the minutiae that elevate an abaya from a simple garment to a piece of wearable art.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Call to Action Parallax */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative w-full h-[60vh] flex items-center justify-center bg-fixed bg-center bg-cover"
          style={{ backgroundImage: `url(${assets.abaya_lifestyle.src})` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          <div className="relative z-10 text-center px-6">
            <h2 className="text-3xl md:text-5xl font-heading text-white uppercase tracking-[0.3em] mb-8 leading-tight">
              Ready to elevate <br/> your style?
            </h2>
            <Link
              href="/all-products"
              className="inline-block px-10 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#A38A6F] hover:text-white transition-colors duration-300"
            >
              Explore The Collection
            </Link>
          </div>
        </motion.section>



      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
