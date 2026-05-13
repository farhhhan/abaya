"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const JournalPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const blogsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogsList);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-body text-[#121212]">
      <Navbar />

      <main className="pb-32">
        {/* Editorial Hero Section */}
        <section className="px-6 md:px-16 lg:px-32 mb-24 pt-10">
          <div className="relative w-full h-[60vh] rounded-none md:rounded-2xl overflow-hidden group">
            <Image
              src={assets.journal_hero}
              alt="The Journal"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-[3s]"
              priority
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
            >
              <p className="text-[10px] md:text-xs text-[#A38A6F] font-black tracking-[0.6em] uppercase mb-6">
                Editorial & Stories
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-heading text-white uppercase tracking-widest leading-tight">
                The Journal
              </h1>
              <div className="w-20 h-[1px] bg-white/30 mt-8"></div>
            </motion.div>
          </div>
        </section>

        {/* Blog Grid Section */}
        <section className="px-6 md:px-16 lg:px-32 max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <div className="w-12 h-12 border-2 border-[#A38A6F]/20 border-t-[#A38A6F] rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A38A6F]">Curating Stories...</p>
            </div>
          ) : blogs.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
            >
              {blogs.map((blog) => (
                <motion.article 
                  key={blog.id}
                  variants={fadeInUp}
                  className="group cursor-pointer"
                >
                  <Link href={`/journal/${blog.id}`}>
                    <div className="relative aspect-[4/5] overflow-hidden mb-8 shadow-2xl shadow-gray-200/50">
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700"></div>
                    </div>
                    
                    <div className="space-y-4 px-2">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-[#A38A6F] uppercase tracking-widest">
                          {blog.createdAt?.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || 'Recent'}
                        </span>
                        <div className="h-[1px] flex-1 bg-gray-100 group-hover:bg-[#A38A6F]/30 transition-colors"></div>
                      </div>
                      
                      <h2 className="text-2xl font-heading uppercase tracking-widest leading-tight group-hover:text-[#A38A6F] transition-colors duration-500">
                        {blog.title}
                      </h2>
                      
                      <p className="text-gray-500 font-light leading-relaxed line-clamp-3 text-sm">
                        {blog.description}
                      </p>
                      
                      <div className="pt-4">
                        <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] border-b border-black pb-1 hover:text-[#A38A6F] hover:border-[#A38A6F] transition-all">
                          Read Narrative
                          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-40 space-y-8">
              <p className="text-gray-400 font-light italic text-xl">Our journal is currently being curated with new stories.</p>
              <Link 
                href="/all-products" 
                className="inline-block px-12 py-5 bg-black text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#A38A6F] transition-colors"
              >
                Back to Collections
              </Link>
            </div>
          )}
        </section>

        {/* Editorial Quote */}
        <section className="px-6 md:px-16 lg:px-32 py-40 mt-20 bg-[#FAFAF9]">
           <div className="max-w-4xl mx-auto text-center space-y-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <svg className="w-12 h-12 text-[#A38A6F]/20 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 8.89543 14.017 10L14.017 13L11.017 13L11.017 10C11.017 7.23858 13.2556 5 16.017 5H19.017C21.7784 5 24.017 7.23858 24.017 10V15C24.017 18.3137 21.3307 21 18.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C3.91243 8 3.017 8.89543 3.017 10L3.017 13L0.017 13L0.017 10C0.017 7.23858 2.25558 5 5.017 5H8.017C10.7784 5 13.017 7.23858 13.017 10V15C13.017 18.3137 10.3307 21 7.017 21H3.017Z" />
                </svg>
                <h3 className="text-3xl md:text-4xl font-heading uppercase tracking-[0.2em] leading-relaxed italic">
                  "Fashion is not just about what you wear, but the stories you tell through every drape and fold."
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#A38A6F] mt-12">
                  Ziyora Boutique Essence
                </p>
              </motion.div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JournalPage;
