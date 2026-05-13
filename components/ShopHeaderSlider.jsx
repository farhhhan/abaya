"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";
import { motion } from "framer-motion";

const slides = [
  {
    id: 1,
    img: assets.shopslider1,
    title: "The Silk Collection",
    subtitle: "Embrace elegance with our latest silk abayas",
    ctaText: "Discover Now",
    ctaHref: "/all-products?category=Abaya",
  },
  {
    id: 2,
    img: assets.shopslider2,
    title: "Modern Modesty",
    subtitle: "Crafted for the contemporary woman",
    ctaText: "Shop The Look",
    ctaHref: "/all-products",
  },
  {
    id: 3,
    img: assets.shopslider3,
    title: "New Arrivals",
    subtitle: "Sophisticated designs for every occasion",
    ctaText: "Explore Collection",
    ctaHref: "/all-products?q=new",
  },
];

export default function ShopHeaderSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count <= 1) return;

    const t = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 4500);

    return () => clearInterval(t);
  }, [paused, count]);

  const goTo = (i) => setIndex((i + count) % count);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  return (
    <section className="relative w-screen overflow-hidden">
      <div className="relative h-[85vh] md:h-[95vh] overflow-hidden">
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="absolute inset-0 flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, idx) => (
            <div
              key={s.id}
              className="relative min-w-full h-[85vh] md:h-[95vh] overflow-hidden"
            >
              <Image
                src={s.img}
                alt={s.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover w-full h-full"
              />

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.1) 100%)",
                }}
              ></div>

              {/* TEXT BLOCK */}
              <div className="absolute left-6 md:left-16 lg:left-32 top-1/2 -translate-y-1/2 text-white max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={idx === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading mb-4 drop-shadow-sm uppercase">
                    {s.title}
                  </h2>

                  <p className="mt-3 md:mt-4 text-lg md:text-2xl text-gray-200 drop-shadow-md">
                    {s.subtitle}
                  </p>

                  <Link
                    href={s.ctaHref}
                    className="inline-flex items-center gap-2 mt-8 bg-black text-white px-10 py-4 uppercase text-[11px] tracking-[0.3em] font-heading hover:bg-white hover:text-black transition-all border border-black"
                  >
                    {s.ctaText}
                  </Link>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* LEFT BUTTON */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-3 shadow-lg backdrop-blur-md"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="#111"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* RIGHT BUTTON */}
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-3 shadow-lg backdrop-blur-md"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="#111"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
