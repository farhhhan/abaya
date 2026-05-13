"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faUserInjured,
  faSnowflake,
  faArrowsLeftRight,
} from "@fortawesome/free-solid-svg-icons";
const defaultItems = [
  {
    id: 0,
    title: "Premium Silk",
    description:
      "We source the finest silk from around the globe, ensuring a luxurious feel and a beautiful drape that moves with you.",
    icon: faLeaf,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 1,
    title: "Hand-Stitched",
    description:
      "Each piece is meticulously hand-stitched by skilled artisans, paying attention to every detail for a flawless finish.",
    icon: faUserInjured,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Modern Cut",
    description:
      "Our designs combine traditional modesty with contemporary silhouettes, creating a unique and sophisticated look.",
    icon: faSnowflake,
    image: "https://images.unsplash.com/photo-1512436991642-274573b1318a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Breathable Fabric",
    description:
      "Crafted with the climate in mind, our fabrics are light and breathable, ensuring comfort without compromising on style.",
    icon: faArrowsLeftRight,
    image: "https://images.unsplash.com/photo-1621285853634-713b7da6b4ca?q=80&w=1000&auto=format&fit=crop",
  },
];

const ComfortShowcase = ({ duration = 3500, className = "" }) => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const stepMs = 40;

  const displayItems = defaultItems;

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIndex((prevIndex) => (prevIndex + 1) % defaultItems.length);
          return 0;
        }
        return prev + (stepMs / duration) * 100;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [paused, duration]);

  useEffect(() => {
    setProgress(0);
  }, [index]);

  const current = displayItems[index];

  return (
    <div
      className={`w-full bg-white py-24 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-[1500px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] font-heading font-medium text-black/40 mb-3">
                Craftsmanship
              </p>

              <h2 className="text-4xl md:text-5xl font-heading text-black leading-tight uppercase tracking-widest">
                Elegance in <br /> Every Detail
              </h2>
            </div>

            <div className="space-y-12">
              {displayItems.map((item, i) => {
                const active = i === index;

                return (
                  <div key={i} className="cursor-pointer" onClick={() => setIndex(i)}>
                    <div className="flex items-center justify-between group">
                      <h3
                        className={`text-sm uppercase tracking-[0.2em] font-heading transition-colors ${active
                          ? "text-black"
                          : "text-black/30 group-hover:text-black/60"
                          }`}
                      >
                        {item.title}
                      </h3>
                      <span className={`text-[10px] font-heading ${active ? "opacity-100" : "opacity-0"}`}>0{i + 1}</span>
                    </div>

                    <div className="w-full h-[1px] bg-black/10 mt-4 relative">
                      {active && (
                        <div
                          className="absolute top-0 left-0 h-full bg-black transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                    </div>

                    <AnimatePresence>
                      {active && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4 }}
                          className="text-sm font-body text-black/60 leading-relaxed overflow-hidden italic"
                        >
                          {item.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="relative w-[650px] lg:w-[850px] h-[450px] lg:h-[650px] overflow-hidden shadow-lg bg-gray-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-full"
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-cover w-full h-full"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComfortShowcase;
