"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Share2, Clock, Heart, Link as LinkIcon } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";

const Facebook = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const SingleJournalPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { userData, isSignedIn } = useAppContext();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setBlog({ id: docSnap.id, ...data });
        const likesList = data.likes || [];
        setLikes(likesList);
        if (userData && likesList.includes(userData.id)) {
          setIsLiked(true);
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blog && userData) {
      setIsLiked(likes.includes(userData.id));
    }
  }, [userData, likes, blog]);

  const handleLike = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to like this story");
      return;
    }

    const docRef = doc(db, "blogs", id);
    try {
      if (isLiked) {
        await updateDoc(docRef, {
          likes: arrayRemove(userData.id)
        });
        setLikes(prev => prev.filter(uid => uid !== userData.id));
        setIsLiked(false);
      } else {
        await updateDoc(docRef, {
          likes: arrayUnion(userData.id)
        });
        setLikes(prev => [...prev, userData.id]);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-2 border-[#A38A6F]/20 border-t-[#A38A6F] rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A38A6F]">Gathering the Narrative...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-heading uppercase tracking-widest mb-6">Narrative Not Found</h2>
        <button
          onClick={() => router.push('/journal')}
          className="px-10 py-4 bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#A38A6F] transition-colors"
        >
          Return to Journal
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-body text-[#121212]">
      <Navbar />

      <main className="pb-32">
        {/* Back Button */}
        <div className="px-6 md:px-16 lg:px-32 py-12">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            Back to Journal
          </button>
        </div>

        {/* Hero Image Section */}
        <section className="px-6 md:px-16 lg:px-32 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto relative rounded-[40px] overflow-hidden shadow-2xl bg-[#F8F8F8] group flex items-center justify-center border border-gray-100"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto max-h-[75vh] object-contain group-hover:scale-[1.02] transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
          </motion.div>
        </section>

        {/* Article Section - Newspaper Layout */}
        <section className="px-6 md:px-16 lg:px-32 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start"
          >
            {/* Left Column: Meta & Interaction */}
            <div className="lg:w-[35%] space-y-12 lg:sticky lg:top-32">
              <div className="space-y-8 pb-8 border-b border-gray-100">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-[#A38A6F] uppercase tracking-[0.4em]">Date Published</span>
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                    {blog.createdAt?.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || 'Recent'}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-[#A38A6F] uppercase tracking-[0.4em]">Reading Time</span>
                  <span className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> 5 Min Read
                  </span>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <span className="text-[10px] font-black text-[#A38A6F] uppercase tracking-[0.4em]">Engagement</span>
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleLike}
                      className={`group flex items-center gap-2 transition-all ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : 'group-hover:fill-current'}`} />
                      <span className="text-sm font-black tracking-widest">{likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-[#A38A6F] transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A38A6F]">About The Narrative</p>
                <p className="text-sm text-gray-500 leading-relaxed font-light italic">
                  This story explores the intersection of traditional craftsmanship and modern modest fashion, curated by our editorial team.
                </p>
              </div>
            </div>

            {/* Right Column: Title & Multi-column Content */}
            <div className="lg:w-[65%] space-y-12">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading uppercase tracking-tight leading-[1.1] text-gray-900">
                  {blog.title}
                </h1>
                <div className="w-20 h-[2px] bg-[#A38A6F]"></div>
              </div>

              <div className="prose prose-stone max-w-none">
                <div className="lg:columns-2 gap-12 lg:space-y-0 text-lg md:text-xl font-light leading-[1.8] text-gray-600 text-justify first-letter:text-7xl first-letter:font-heading first-letter:text-[#A38A6F] first-letter:mr-4 first-letter:float-left whitespace-pre-wrap">
                  {blog.description}
                </div>
              </div>

              {/* Editorial Pullquote */}
              <div className="bg-[#FAFAF9] p-12 rounded-[32px] border-l-4 border-[#A38A6F] my-12">
                <h3 className="text-xl md:text-2xl font-heading italic text-gray-800 leading-relaxed uppercase tracking-widest">
                  "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution."
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A38A6F] mt-6">
                  — ABAYA Editorial Philosophy
                </p>
              </div>
            </div>
          </motion.div>

          {/* Share Section */}
          <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#A38A6F] flex items-center justify-center text-white font-heading text-lg">A</div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-900">ABAYA Editorial Team</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Global Brand Communications</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Share Narrative:</span>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <LinkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SingleJournalPage;
