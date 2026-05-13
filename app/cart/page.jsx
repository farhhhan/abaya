'use client'
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import Footer from "@/components/Footer";
import { 
    ShoppingBag, 
    Trash2, 
    ChevronRight, 
    Plus, 
    Minus, 
    Scissors, 
    Sparkles 
} from "lucide-react";

const Cart = () => {
    const { products, router, cartItems, updateCartQuantity, getCartCount, currency, currencySymbol, resolvePrice } = useAppContext();
    const [cartMetadata, setCartMetadata] = useState({});

    useEffect(() => {
        const metadata = localStorage.getItem('cartMetadata');
        if (metadata) {
            try {
                setCartMetadata(JSON.parse(metadata));
            } catch (e) {
                console.error("Error parsing cart metadata:", e);
            }
        }
    }, [cartItems]);

    const hasItems = getCartCount() > 0;

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 pt-14 pb-24">
                
                <FadeIn delay={0.1}>
                    <div className="flex items-end justify-between mb-16 border-b border-gray-100 pb-10">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                                Boutique<br/><span className="text-[#A38A6F]">Collection</span>
                            </h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Curated Artisan Selection ({getCartCount()} Pieces)</p>
                        </div>
                        <Link 
                            href="/all-products" 
                            className="bg-black text-white text-[9px] font-black px-8 py-3 rounded-full uppercase tracking-widest hover:bg-[#1C1C1C] transition-all"
                        >
                            Continue Discovery
                        </Link>
                    </div>
                </FadeIn>

                <div className="flex flex-col lg:flex-row gap-20">
                    
                    {/* Cart Items Portfolio */}
                    <div className="flex-1">
                        {hasItems ? (
                            <div className="space-y-8">
                                <AnimatePresence mode="popLayout">
                                    {Object.keys(cartItems).map((key) => {
                                        const [productId, size] = key.split('-');
                                        const product = products.find(p => p._id === productId);
                                        const metadata = cartMetadata[key] || {};
                                        
                                        // Priority 1: Image stored in metadata (selected by user at add-to-cart)
                                        let displayImage = metadata.image;
                                        
                                        // Priority 2: Try to find variant image based on color if metadata image is missing
                                        if (!displayImage && metadata.color && product.variants) {
                                            const variant = product.variants.find(v => v.color?.toLowerCase() === metadata.color?.toLowerCase());
                                            displayImage = variant?.images?.[0] || variant?.image;
                                        }
                                        
                                        // Priority 3: Smart Fallback (color name in filename)
                                        if (!displayImage && metadata.color && product.image) {
                                            displayImage = product.image.find(img => img.toLowerCase().includes(metadata.color.toLowerCase()));
                                        }
                                        
                                        // Priority 4: Default Product Image
                                        displayImage = displayImage || (product.image && product.image.length > 0 ? product.image[0] : assets.upload_area);

                                        return (
                                            <motion.div
                                                key={key}
                                                layout
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="group relative bg-[#FDFDFD] rounded-[48px] p-8 md:p-10 border border-gray-50 flex flex-col md:flex-row gap-10 hover:border-[#A38A6F]/20 hover:shadow-2xl hover:shadow-gray-100 transition-all duration-700"
                                            >
                                                {/* Visual Artifact */}
                                                <div className="w-40 h-52 flex-shrink-0 bg-[#F8F8F8] rounded-[32px] overflow-hidden relative border border-gray-100 shadow-sm group-hover:scale-[1.02] transition-transform duration-700">
                                                    <Image
                                                        src={displayImage}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover mix-blend-multiply"
                                                    />
                                                </div>

                                                {/* Artisan Details */}
                                                <div className="flex-1 flex flex-col justify-between py-2">
                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-black text-[#A38A6F] uppercase tracking-[0.4em]">{product.category?.[0] || 'Luxury'}</p>
                                                            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none uppercase">{product.name}</h2>
                                                        </div>

                                                        <div className="flex flex-wrap gap-3">
                                                            {size && size !== "bespoke" && (
                                                                <div className="flex items-center gap-2 px-4 py-2 bg-[#FAFAFA] rounded-2xl border border-gray-50">
                                                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Size</span>
                                                                    <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">{size.replace(',', ' x ')} in</span>
                                                                </div>
                                                            )}
                                                            {metadata.color && (
                                                                <div className="flex items-center gap-2 px-4 py-2 bg-[#FAFAFA] rounded-2xl border border-gray-50">
                                                                    <div 
                                                                        className="w-2 h-2 rounded-full shadow-inner border border-black/5" 
                                                                        style={{ backgroundColor: product.variants?.find(v => v.color?.toLowerCase() === metadata.color?.toLowerCase())?.hex || metadata.color.toLowerCase() }} 
                                                                    />
                                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{metadata.color}</span>
                                                                </div>
                                                            )}
                                                            {metadata.bespoke && (
                                                                <div className="flex items-center gap-2 px-4 py-2 bg-[#FAFAFA] rounded-2xl border border-gray-50">
                                                                    <Scissors className="w-3 h-3 text-[#A38A6F]" />
                                                                    <span className="text-[9px] font-black text-[#A38A6F] uppercase tracking-widest">Bespoke Boutique Piece</span>
                                                                </div>
                                                            )}
                                                            {!metadata.bespoke && !metadata.color && !size && (
                                                                <div className="flex items-center gap-2 px-4 py-2 bg-[#FAFAFA] rounded-2xl border border-gray-50">
                                                                    <Sparkles className="w-3 h-3 text-gray-300" />
                                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Standard Edition</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {metadata.bespoke && (
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 pt-2">
                                                                {Object.entries(metadata.bespoke.customMeasurements || {}).map(([label, val]) => (
                                                                    <div key={label} className="space-y-0.5">
                                                                        <p className="text-[7px] font-black text-gray-300 uppercase tracking-[0.2em]">{label}</p>
                                                                        <p className="text-[10px] font-black text-gray-900">{val} in</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between pt-8 md:pt-0">
                                                        <div className="flex items-center gap-6 border border-gray-200 rounded-full px-6 py-2 bg-white shadow-inner">
                                                            <button onClick={() => updateCartQuantity(key, cartItems[key] - 1)} className="text-gray-300 hover:text-black font-light"><Minus className="w-4 h-4"/></button>
                                                            <span className="text-sm font-black text-gray-900 min-w-4 text-center">{cartItems[key]}</span>
                                                            <button onClick={() => updateCartQuantity(key, cartItems[key] + 1)} className="text-gray-300 hover:text-black font-light"><Plus className="w-4 h-4"/></button>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-black text-gray-900 tracking-tighter">{currencySymbol}{(resolvePrice(product) * cartItems[key]).toLocaleString()}</p>
                                                            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{currencySymbol}{resolvePrice(product)?.toLocaleString()} ea.</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Remove Artisan Piece */}
                                                <button
                                                    onClick={() => updateCartQuantity(key, 0)}
                                                    className="absolute top-8 right-8 p-3 text-gray-300 hover:text-black hover:bg-gray-50 rounded-full transition-all"
                                                    title="Release Piece"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-32 bg-[#F8F8F8] rounded-[64px] border border-gray-100 border-dashed"
                            >
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-gray-200">
                                    <ShoppingBag className="w-8 h-8 text-[#A38A6F] opacity-40" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">Your Private Gallery is Empty</h2>
                                <p className="text-gray-400 font-medium mb-12 max-w-sm mx-auto text-sm leading-relaxed uppercase tracking-widest">Discover our latest artisan abaya collection and curate your premium modest wardrobe.</p>
                                <button
                                    onClick={() => router.push('/all-products')}
                                    className="px-12 py-5 bg-black text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-full hover:bg-[#1C1C1C] transition-all shadow-2xl"
                                >
                                    Begin Discovery
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Collection Summary Hub */}
                    {hasItems && (
                        <div className="lg:w-[450px]">
                            <div className="sticky top-40 space-y-6">
                                <div className="px-6 py-2">
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900">Boutique Summary</h3>
                                    <p className="text-[9px] font-bold text-[#A38A6F] uppercase tracking-[0.3em]">Final piece valuation</p>
                                </div>
                                <OrderSummary />
                                
                                <div className="p-6 bg-[#FAFAFA] rounded-[32px] border border-gray-100 flex items-center gap-4">
                                     <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm">
                                         <Sparkles className="w-5 h-5 text-[#A38A6F]" />
                                     </div>
                                     <div className="text-left">
                                         <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Artisan Guarantee</p>
                                         <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Hand-inspected before dispatch</p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Cart;
