"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const NewCollectionSlider = () => {
    const { products, currencySymbol, productsLoading, resolvePrice } = useAppContext();
    const scrollRef = useRef(null);

    // Filter for new collection or just take the first 8
    const displayProducts = products.slice(0, 10);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - 500
                : scrollLeft + 500;

            scrollRef.current.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    };

    if (productsLoading) {
        return (
            <div className="w-full h-[600px] bg-[#F9F9F9] flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-[#A38A6F] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <section className="relative w-full bg-white py-12 md:py-20 overflow-hidden border-t border-gray-50">
            {/* Header Area - Now Truly Full Width with fixed padding */}
            {/* Header Area - Centered and Minimalist */}
            <div className="w-full px-6 md:px-20 mb-12 flex flex-col items-center text-center gap-6">
                <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-400">
                        New Arrivals
                    </span>
                    <h2 className="text-3xl md:text-4xl font-heading tracking-tight text-gray-900 uppercase">
                        New Collection
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => scroll('left')}
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all duration-300"
                        aria-label="Scroll Left"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all duration-300"
                        aria-label="Scroll Right"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Slider Content - Truly Edge to Edge */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 md:px-20 scroll-smooth pb-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {displayProducts.map((product, index) => (
                    <motion.div
                        key={product._id || index}
                        className="min-w-[80vw] md:min-w-[calc(25%-12px)] snap-start group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Link href={`/product/${product._id}`} className="block">
                            <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F9F9]">
                                {/* Secondary Image (Transitions in on hover) */}
                                {product.image?.[1] && (
                                    <Image
                                        src={product.image[1]}
                                        alt={`${product.name} view 2`}
                                        fill
                                        className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"
                                        sizes="(max-width: 768px) 80vw, 25vw"
                                    />
                                )}

                                {/* Primary Image */}
                                <Image
                                    src={product.image?.[0] || assets.upload_area}
                                    alt={product.name}
                                    fill
                                    className={`object-cover transition-all duration-700 ease-in-out ${product.image?.[1] ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
                                    sizes="(max-width: 768px) 80vw, 25vw"
                                />

                                {/* Badges at bottom left */}
                                <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
                                    {product.price > product.offerPrice && (
                                        <div className="bg-black/80 text-white text-[8px] font-medium px-3 py-1 uppercase tracking-widest backdrop-blur-sm">
                                            Sale
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 space-y-1 text-center">
                                <h3 className="text-[13px] font-medium text-gray-800 uppercase tracking-tight">
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-[13px] font-semibold text-gray-900">
                                        {currencySymbol}{Number(resolvePrice(product)).toLocaleString()}
                                    </span>
                                    {product.price > resolvePrice(product) && (
                                        <span className="text-[11px] text-gray-400 line-through">
                                            {currencySymbol}{Number(product.price).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}

                {/* View All Card */}
                <motion.div className="min-w-[80vw] md:min-w-[calc(25%-12px)] flex items-center justify-center p-8 bg-gray-50/50">
                    <Link href="/all-products" className="group text-center space-y-4">
                        <div className="relative w-16 h-16 flex items-center justify-center mx-auto border border-gray-200 rounded-full group-hover:border-black transition-all duration-500">
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <span className="block text-[11px] font-medium uppercase tracking-[0.2em]">View All</span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default NewCollectionSlider;
