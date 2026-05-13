"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import ProductReviews from "@/components/ProductReviews";
import FadeIn from "@/components/FadeIn";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  StarHalf, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles,
  ChevronRight,
  Maximize2,
  Scissors,
  Heart
} from "lucide-react";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Product = () => {
    const { id } = useParams();
    const { products, router, addToCart, currency, currencySymbol, resolvePrice, addToWishlist, removeFromWishlist, isInWishlist } = useAppContext()
    
    // Core State
    const [productData, setProductData] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [activeVariant, setActiveVariant] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isBespokeEnabled, setIsBespokeEnabled] = useState(false);
    const [customMeasurements, setCustomMeasurements] = useState({});

    // Rating State
    const [ratingData, setRatingData] = useState({ average: 4.8, count: 12 });

    useEffect(() => {
        const product = products.find(product => product._id === id);
        if (product) {
            setProductData(product);
            if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
        }
    }, [id, products.length]);

    useEffect(() => {
        const fetchRatingData = async () => {
            if (!id) return;
            try {
                const reviewsRef = collection(db, 'reviews');
                const q = query(reviewsRef, where('productId', '==', id));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const reviews = snapshot.docs.map(doc => doc.data());
                    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                    setRatingData({
                        average: Number((totalRating / reviews.length).toFixed(1)),
                        count: reviews.length
                    });
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };
        fetchRatingData();
    }, [id]);

    if (!productData) return <Loading />;

    // Gallery Logic
    const variantImages = productData.variants && productData.variants[activeVariant] 
        ? productData.variants[activeVariant].images 
        : [];
    
    const globalImages = productData.image || productData.images || [];
    const imageGallery = (variantImages.length > 0 ? variantImages : globalImages).filter(img => typeof img === 'string');
    const displayedImage = mainImage || imageGallery[0] || assets.upload_area;

    const handleAddToCart = () => {
        const bespokeDetails = isBespokeEnabled ? { customMeasurements } : null;
        const colorDetails = productData.variants?.[activeVariant]?.color || null;
        
        addToCart(
            productData._id, 
            quantity, 
            selectedSize, 
            null, // thickness not used for abayas
            productData.category?.[0],
            { color: colorDetails, bespoke: bespokeDetails, image: displayedImage }
        );
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            
            <div className="px-6 md:px-16 lg:px-32 pt-14 pb-24 space-y-24">
                
                {/* Upper Section: Visual Showcase & Brief */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    
                    {/* Left: Artisan Gallery */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-24">
                            <div className="rounded-[40px] overflow-hidden bg-[#F8F8F8] mb-6 shadow-sm border border-gray-100 relative aspect-[4/5] group max-w-[480px]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={displayedImage}
                                        initial={{ opacity: 0, scale: 1.05 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="relative w-full h-full"
                                    >
                                        <Image 
                                            src={displayedImage} 
                                            alt={productData.name} 
                                            fill 
                                            className="object-cover mix-blend-multiply"
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>
                                <div className="absolute top-8 left-8 flex flex-col gap-3">
                                    <div className="bg-black text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-2xl">
                                        Artisan Collection
                                    </div>
                                    {productData.offerPrice < productData.price && (
                                        <div className="bg-amber-500 text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-2xl">
                                            Limited Spotlight
                                        </div>
                                    )}
                                </div>
                                <button className="absolute bottom-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform">
                                    <Maximize2 className="w-5 h-5 text-gray-900" />
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-4 px-2">
                                {imageGallery.map((img, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        key={idx} 
                                        whileHover={{ y: -4 }}
                                        onClick={() => setMainImage(img)}
                                        className={`cursor-pointer aspect-square relative rounded-2xl overflow-hidden border-2 transition-all duration-500 ${displayedImage === img ? "border-black shadow-lg" : "border-transparent opacity-40 hover:opacity-100"}`}
                                    >
                                        <Image src={img} alt="thumb" fill className="object-cover mix-blend-multiply" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Signature Details */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        className="lg:col-span-8 flex flex-col space-y-12"
                    >
                        
                        {/* Header Details */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <motion.div 
                                    variants={{
                                        hidden: { opacity: 0, x: -20 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                    className="flex items-center gap-3"
                                >
                                    <p className="text-[#A38A6F] font-black tracking-[0.4em] uppercase text-[10px]">
                                        {productData.category?.[0] || 'Luxury Boutique'}
                                    </p>
                                    <span className="w-1 h-1 rounded-full bg-gray-200" />
                                    <p className="text-gray-400 font-bold tracking-[0.2em] uppercase text-[10px]">
                                        Ref: {productData._id.slice(-6).toUpperCase()}
                                    </p>
                                </motion.div>
                                <motion.h1 
                                    variants={{
                                        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                                        visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                                    }}
                                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                                    className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9]"
                                >
                                    {productData.name}
                                </motion.h1>
                            </div>

                            <motion.div 
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1 }
                                }}
                                className="flex items-center gap-6"
                            >
                                <div className="flex items-center gap-1.5">
                                    {[1,2,3,4].map(s => <Star key={s} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
                                    <StarHalf className="w-4 h-4 fill-amber-500 text-amber-500" />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    {ratingData.count} Artisan Reviews
                                </span>
                            </motion.div>

                            <motion.p 
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                className="text-gray-500 leading-relaxed font-medium text-lg max-w-xl"
                            >
                                {productData.description || "Indulge in the epitome of modest luxury. Handcrafted with precision and composed of the finest materials, this piece is designed for timeless elegance."}
                            </motion.p>
                        </div>

                        {/* Pricing Hub */}
                        <motion.div 
                            variants={{
                                hidden: { opacity: 0, scale: 0.95 },
                                visible: { opacity: 1, scale: 1 }
                            }}
                            className="p-10 bg-[#FDFDFD] rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/20 space-y-3"
                        >
                            <div className="flex items-baseline gap-5">
                                <span className="text-5xl font-black text-gray-900">{currencySymbol}{resolvePrice(productData).toLocaleString()}</span>
                                {productData.price > resolvePrice(productData) && (
                                    <span className="text-2xl font-bold text-gray-300 line-through">{currencySymbol}{productData.price?.toLocaleString()}</span>
                                )}
                                {productData.price > resolvePrice(productData) && (
                                    <span className="bg-black text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                                        Saved {Math.round(((productData.price - resolvePrice(productData)) / productData.price) * 100)}%
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Inclusive of global artisan craftsmanship & VAT</p>
                        </motion.div>

                        {/* Variant Selection (Chromatic Images Mapping) */}
                        {productData.variants && productData.variants.length > 0 && (
                            <motion.div 
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1 }
                                }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">Chromatic Shade</label>
                                    <span className="text-[10px] font-bold text-[#A38A6F] uppercase tracking-widest">{productData.variants[activeVariant].color}</span>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {productData.variants.map((v, vIdx) => (
                                        <button 
                                            key={vIdx}
                                            onClick={() => { setActiveVariant(vIdx); setMainImage(null); }}
                                            className={`relative h-14 w-14 rounded-full transition-all duration-500 p-1.5 ${activeVariant === vIdx ? "ring-2 ring-black shadow-2xl scale-110" : "hover:scale-105 opacity-60 hover:opacity-100"}`}
                                        >
                                            <div 
                                                className="w-full h-full rounded-full border border-white shadow-inner" 
                                                style={{ backgroundColor: v.hex || '#000' }} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Standard Size Selector or Bespoke Trigger */}
                        <motion.div 
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">Standard Blueprint</label>
                                <button className="text-[10px] font-black text-[#A38A6F] underline uppercase tracking-widest decoration-2 underline-offset-4">Size Consultant</button>
                            </div>
                            
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                {productData.sizes?.map(size => (
                                    <button 
                                        key={size}
                                        onClick={() => { setSelectedSize(size); setIsBespokeEnabled(false); }}
                                        className={`h-14 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all duration-300 ${selectedSize === size && !isBespokeEnabled ? "bg-black text-white shadow-2xl scale-105" : "bg-white text-gray-400 border border-gray-100 hover:border-black hover:text-black"}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>

                            {/* Bespoke Measurement Integration */}
                            {productData.customCuts && productData.customCuts.length > 0 && (
                                <button 
                                    onClick={() => setIsBespokeEnabled(true)}
                                    className={`w-full p-6 rounded-[32px] border-2 border-dashed flex items-center justify-between transition-all duration-500 ${isBespokeEnabled ? "bg-[#1C1C1C] border-[#A38A6F] text-white shadow-2xl" : "bg-white border-gray-100 text-gray-400 hover:border-black hover:text-gray-900 group"}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${isBespokeEnabled ? "bg-[#A38A6F]/20 text-[#A38A6F]" : "bg-gray-50 text-gray-400 group-hover:text-black"}`}>
                                            <Scissors className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-black uppercase tracking-widest">Bespoke Boutique Experience</p>
                                            <p className="text-[9px] font-medium opacity-60 uppercase tracking-widest">Personalized Artisan Measurement</p>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 transition-transform duration-500 ${isBespokeEnabled ? "rotate-90 text-[#A38A6F]" : "group-hover:translate-x-1"}`} />
                                </button>
                            )}
                            
                            <AnimatePresence>
                                {isBespokeEnabled && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="grid grid-cols-2 gap-4 pt-4 overflow-hidden"
                                    >
                                        {productData.customCuts.map(cut => (
                                            <div key={cut} className="space-y-2">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">{cut} (in)</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="0.0" 
                                                    value={customMeasurements[cut] || ""}
                                                    onChange={(e) => setCustomMeasurements({...customMeasurements, [cut]: e.target.value})}
                                                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-[20px] text-sm font-bold focus:bg-white focus:border-[#A38A6F] outline-none transition-all"
                                                />
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Artisan CTA Section */}
                        <motion.div 
                            variants={{
                                hidden: { opacity: 0, scale: 0.9 },
                                visible: { opacity: 1, scale: 1 }
                            }}
                            className="flex items-center gap-6 pt-10 border-t border-gray-100"
                        >
                            <div className="flex items-center gap-6 border border-gray-200 rounded-full px-8 py-4 bg-white/50 shadow-inner">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black text-2xl font-light">-</button>
                                <span className="text-lg font-black text-gray-900 min-w-8 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black text-2xl font-light">+</button>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                className="flex-[3] py-6 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-gray-300 hover:bg-[#1C1C1C] hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                {isBespokeEnabled ? 'Secure Bespoke Piece' : 'Add to Collection'}
                            </button>
                            <button 
                                onClick={() => isInWishlist(productData._id) ? removeFromWishlist(productData._id) : addToWishlist(productData._id)}
                                className={`flex-1 py-6 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${isInWishlist(productData._id) ? "bg-red-500 text-white" : "bg-white border border-gray-100 text-red-500 hover:bg-red-50"}`}
                            >
                                <Heart className={`w-5 h-5 ${isInWishlist(productData._id) ? "fill-current" : ""}`} />
                            </button>
                        </motion.div>

                        {/* Luxury Trust Indicators */}
                        <div className="grid grid-cols-2 gap-4 pt-10 border-t border-gray-100">
                            {[
                                { icon: ShieldCheck, label: 'Quality', val: 'Verified Artisan' },
                                { icon: Truck, label: 'Delivery', val: 'Global Priority' },
                                { icon: RotateCcw, label: 'Returns', val: '14-Day Boutique' },
                                { icon: Sparkles, label: 'Fabric', val: productData.specifications?.fabric || 'Premium Nida' }
                            ].map((item, i) => (
                                <motion.div 
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    key={i} 
                                    className="flex items-center gap-4 p-5 bg-[#FAFAFA] rounded-3xl border border-gray-50 group hover:border-[#A38A6F]/20 transition-all duration-500"
                                >
                                    <item.icon className="w-5 h-5 text-gray-300 group-hover:text-[#A38A6F] transition-colors" />
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-[10px] font-black text-gray-900">{item.val}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </motion.div>
                </div>

                {/* Artisan Specs Section & Tech Specs */}
                <div className="space-y-32">
                    
                    {/* Extended Specifications (The Luxury Details) */}
                    <FadeIn>
                        <section className="bg-[#1C1C1C] text-white rounded-[64px] p-12 md:p-20 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-150" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10">
                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <h2 className="text-5xl font-black tracking-tight leading-none uppercase">Artisan<br/>Specifications</h2>
                                        <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-sm font-light">
                                            Every piece in the {productData.category?.[0] || 'Luxury'} series undergoes a rigorous curation process ensuring fabric integrity and tailoring excellence.
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-8">
                                        {[
                                            { label: 'Primary Fabric', val: productData.specifications?.fabric || 'Luxury Nida' },
                                            { label: 'Fabric Weight', val: productData.specifications?.weight || 'Lightweight' },
                                            { label: 'Hijab Included', val: productData.specifications?.hijabInclusion ? 'Yes (Matching Artisan Shade)' : 'No' },
                                            { label: 'Care Instructions', val: productData.specifications?.care || 'Artisan Dry Clean Only' }
                                        ].map((spec, sIdx) => (
                                            <div key={sIdx} className="flex items-center justify-between border-b border-white/10 pb-4 group/item">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] group-hover/item:text-white transition-colors">{spec.label}</span>
                                                <span className="text-xs font-black uppercase tracking-widest text-[#A38A6F]">{spec.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="space-y-8">
                                    <div className="rounded-[40px] overflow-hidden bg-white/5 p-8 border border-white/10 flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#A38A6F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                        <div className="text-center space-y-6 relative z-10">
                                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                                                <Sparkles className="w-8 h-8 text-white" />
                                            </div>
                                            <p className="text-2xl font-black uppercase tracking-tighter leading-tight">Master Craftsmanship<br/>Individually Tailored</p>
                                            <button className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#A38A6F] hover:text-white transition-all">Verfied Blueprint</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </FadeIn>

                    {/* Discovery Grid (Featured Collections) */}
                    <FadeIn delay={0.2}>
                        <div className="space-y-16">
                            <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black tracking-tighter flex items-center gap-4 uppercase">
                                        Discover <span className="text-[#A38A6F]">Elegance</span>
                                    </h2>
                                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em]">Curated Artisan Spotlight</p>
                                </div>
                                <button className="px-10 py-4 bg-white border border-gray-200 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">View Full Portfolio</button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                                {products.slice(0, 5).map((p, index) => (
                                    <ProductCard key={index} product={p} />
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Community Reviews Section */}
                    <FadeIn delay={0.4}>
                        <div className="space-y-12">
                             <div className="p-12 md:p-20 bg-[#F8F8F8] rounded-[64px] border border-gray-100">
                                <ProductReviews productId={id} />
                             </div>
                        </div>
                    </FadeIn>

                </div>

            </div>

            <Footer />
        </div>
    );
};

export default Product;
