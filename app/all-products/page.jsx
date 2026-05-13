'use client'
import React, { useMemo, useEffect, useState, Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import HeaderSlider from "@/components/HeaderSlider";
import Footer from "@/components/Footer";
import FiltersSidebar from "@/components/FiltersSidebar";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const AllProductsContent = () => {

    const { products, productsLoading, currency, currencySymbol, router } = useAppContext();

    const searchParams = useSearchParams();
    const queryRaw = searchParams.get("q") || "";
    const query = queryRaw.trim().toLowerCase();
    const categoryQuery = searchParams.get("category") || "";
    const category = categoryQuery.trim().toLowerCase();

    const normalize = (v) => (v || "").toString().toLowerCase();
    
    const allCategories = useMemo(() => {
        const cats = new Set();
        products.forEach(p => {
            const productCats = Array.isArray(p.category) ? p.category : [p.category];
            productCats.forEach(c => {
                if (c) cats.add(c);
            });
        });
        return Array.from(cats);
    }, [products]);

    const matchesQuery = (p) => {
        if (!query) return true;
        return [p?.name, p?.description].some((v) => normalize(v).includes(query)) || 
               (Array.isArray(p.category) ? p.category : [p.category]).some(c => normalize(c).includes(query));
    };

    // Prices
    const prices = useMemo(
        () => products.map((p) => Number(p.offerPrice || 0)).filter((n) => !isNaN(n)),
        [products]
    );

    const baseMin = prices.length ? Math.min(...prices) : 0;
    const baseMax = prices.length ? Math.max(...prices) : 0;

    const [priceMin, setPriceMin] = useState(baseMin);
    const [priceMax, setPriceMax] = useState(baseMax);

    useEffect(() => {
        setPriceMin(baseMin);
        setPriceMax(baseMax);
    }, [baseMin, baseMax]);

    // Filtering
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const price = Number(p.offerPrice || 0);
            
            let matchesCat = true;
            if (category) {
                const cats = Array.isArray(p.category) ? p.category : [p.category];
                matchesCat = cats.some(c => normalize(c) === category);
            }
            
            return matchesQuery(p) && matchesCat && price >= priceMin && price <= priceMax;
        });
    }, [products, query, category, priceMin, priceMax]);

    const handleApply = (min, max) => {
        setPriceMin(Number(min));
        setPriceMax(Number(max));
    };

    const handleClear = () => {
        setPriceMin(baseMin);
        setPriceMax(baseMax);
        router.push("/all-products");
    };

    const handleCategoryChange = (cat) => {
        const params = new URLSearchParams(searchParams.toString());
        if (cat) {
            params.set("category", cat);
        } else {
            params.delete("category");
        }
        router.push("/all-products?" + params.toString());
    };

    const isDefault = !query && !category && priceMin === baseMin && priceMax === baseMax;

    return (
        <>
            <Navbar />

            {/* FIX: Added proper spacing so content never drops down */}
            <div className="pt-4" />

            <HeaderSlider />

            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-end pt-12"
                >
                    <p className="text-2xl font-medium">All Products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </motion.div>

                {productsLoading ? (
                    <div className="w-full py-16 text-center text-gray-500 animate-pulse">
                        Loading products...
                    </div>
                ) : (
                    <>
                        {/* Chips + Clear Button */}
                        <div className="flex items-center justify-between w-full mt-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                {query && (
                                    <span className="text-xs bg-gray-100 border rounded-full px-3 py-1">
                                        Search: "{queryRaw}"
                                    </span>
                                )}
                                {category && (
                                    <span className="text-xs bg-gray-100 border rounded-full px-3 py-1">
                                        Category: {categoryQuery}
                                    </span>
                                )}
                                {(priceMin !== baseMin || priceMax !== baseMax) && (
                                    <span className="text-xs bg-gray-100 border rounded-full px-3 py-1">
                                        Price: {currencySymbol}{priceMin} - {currencySymbol}{priceMax}
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleClear}
                                disabled={isDefault}
                                className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full disabled:opacity-50"
                            >
                                Show all products
                            </button>
                        </div>

                        {/* Main Layout */}
                        <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-[20rem,1fr] md:gap-12 lg:gap-16 xl:gap-20 pb-14">

                            {/* Sidebar */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <FiltersSidebar
                                    currencySymbol={currencySymbol}
                                    min={baseMin}
                                    max={baseMax}
                                    valueMin={priceMin}
                                    valueMax={priceMax}
                                    categories={allCategories}
                                    activeCategory={category}
                                    onApply={handleApply}
                                    onClear={handleClear}
                                    onCategoryChange={handleCategoryChange}
                                    disabled={!prices.length}
                                />
                            </motion.div>

                            {/* Product Grid */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-start gap-6 w-full md:pl-2"
                            >
                                <AnimatePresence>
                                    {filteredProducts.length ? (
                                        filteredProducts.map((product) => (
                                            <motion.div
                                                key={product._id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 col-span-full">
                                            {query
                                                ? "No products match your filters."
                                                : "No products available yet."}
                                        </p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

const AllProducts = () => (
    <Suspense
        fallback={
            <div className="w-full h-screen flex items-center justify-center animate-pulse">
                Loading...
            </div>
        }
    >
        <AllProductsContent />
    </Suspense>
);

export default AllProducts;
