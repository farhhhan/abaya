'use client'
import React from "react";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

const WishlistPage = () => {
    const { wishlist, products, productsLoading } = useAppContext();

    const wishlistedProducts = products.filter(p => wishlist.includes(p._id));

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 pt-14 pb-24">
                
                <FadeIn delay={0.1}>
                    <div className="flex items-end justify-between mb-16 border-b border-gray-100 pb-10">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                                My Boutique<br/><span className="text-[#A38A6F]">Wishlist</span>
                            </h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Your Curated Artisan Selection ({wishlistedProducts.length} Pieces)</p>
                        </div>
                        <Link 
                            href="/all-products" 
                            className="bg-black text-white text-[9px] font-black px-8 py-3 rounded-full uppercase tracking-widest hover:bg-[#1C1C1C] transition-all"
                        >
                            Explore More
                        </Link>
                    </div>
                </FadeIn>

                {productsLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-[32px] animate-pulse" />
                        ))}
                    </div>
                ) : wishlistedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                        {wishlistedProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 space-y-8">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                            <Heart className="w-10 h-10 text-gray-200" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Your wishlist is empty</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start curating your favorite artisan pieces</p>
                        </div>
                        <Link 
                            href="/all-products" 
                            className="flex items-center gap-4 bg-black text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#1C1C1C] transition-all"
                        >
                            Discovery Collection
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default WishlistPage;
