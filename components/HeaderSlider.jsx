import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const HeaderSlider = () => {
    const [sliderData, setSliderData] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    const defaultSlides = [
        {
            id: 'default1',
            title: "Sophisticated Elegance for the Modern Woman",
            description: "Discover our latest collection of premium silk abayas, handcrafted with precision and love.",
            category: "Abaya",
            imageUrl: assets.new_abaya_hero_1.src || assets.new_abaya_hero_1,
        },
        {
            id: 'default2',
            title: "The Ultimate Modest Suit Collection",
            description: "Sharp lines meet modest silhouettes in our new line of professional attire.",
            category: "Suit",
            imageUrl: assets.new_abaya_hero_2.src || assets.new_abaya_hero_2,
        },
        {
            id: 'default3',
            title: "Timeless Traditional Kaftans",
            description: "Experience the heritage of fine tailoring with our embroidered kaftan series.",
            category: "Dress",
            imageUrl: assets.shopslider1.src || assets.shopslider1,
        },
    ];

    useEffect(() => {
        const q = query(collection(db, "advertisements"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ads = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            if (ads.length > 0) {
                setSliderData(ads);
            } else {
                setSliderData(defaultSlides);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching ads:", error);
            setSliderData(defaultSlides);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (sliderData.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % sliderData.length);
            }, 6000); 
            return () => clearInterval(interval);
        }
    }, [sliderData.length]);

    const handleSlideChange = (index) => {
        setCurrentSlide(index);
    };

    if (loading) {
        return <div className="h-[300px] md:h-[450px] w-full bg-gray-50 animate-pulse" />;
    }

    return (
        <div className="relative w-full h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden bg-white">
            <AnimatePresence mode="wait">
                {sliderData.map((slide, index) => (
                    index === currentSlide && (
                        <motion.div
                            key={slide.id || index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <div className="flex flex-col md:flex-row items-center h-full"> 
                                {/* Image Section - Magazine Style */}
                                <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden bg-[#FAF9F6] flex items-center justify-center">
                                     <motion.div 
                                        initial={{ scale: 1.05 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 6, ease: "linear" }}
                                        className="w-full h-full relative flex items-center justify-center"
                                     >
                                         <Image 
                                            src={slide.imageUrl || slide.imgSrc} 
                                            alt={slide.title} 
                                            fill 
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority
                                        />
                                     </motion.div>
                                    <div className="absolute inset-0 bg-black/5" />
                                </div>

                                {/* Text content Section */}
                                <div className="w-full md:w-1/2 h-1/2 md:h-full bg-[#FAF9F6] flex items-center justify-center p-8 md:p-16 lg:p-24">
                                    <div className="max-w-xl space-y-6 md:space-y-8">
                                        <div className="space-y-4">
                                            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] text-[#A38A6F]">
                                                {slide.category === 'All Products' ? 'Curated Series' : `${slide.category} Series`}
                                            </span>
                                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading tracking-tight leading-[0.9] text-gray-900 uppercase">
                                                {slide.title}
                                            </h2>
                                            <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed max-w-md">
                                                {slide.description}
                                            </p>
                                        </div>

                                        <Link 
                                            href={(slide.category === 'All Products' || !slide.category) ? '/all-products' : `/all-products?category=${slide.category}`}
                                            className="group inline-flex items-center gap-6 pt-4"
                                        >
                                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 border-b-2 border-gray-900 pb-1">
                                                Explore Collection
                                            </span>
                                            <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                ))}
            </AnimatePresence>

            {/* Pagination Controls */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-auto md:right-16 md:translate-x-0 flex items-center gap-3">
                {sliderData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleSlideChange(index)}
                        className={`transition-all duration-500 ${
                            currentSlide === index 
                            ? "w-8 h-1 bg-black" 
                            : "w-2 h-1 bg-gray-200 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeaderSlider;
