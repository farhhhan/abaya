"use client";
import React from "react";
import Link from "next/link";
import { assets } from "../../assets/assets";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const SideBar = () => {
    const pathname = usePathname();
    const menuItems = [
        { name: "Users", path: "/seller/users", icon: assets.user_icon },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
        { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Add Product", path: "/seller", icon: assets.add_icon },
    ];

    return (
        <div className="md:w-72 w-20 border-r border-gray-200 min-h-screen bg-white py-6 flex flex-col sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
            <div className="space-y-2 px-3 md:px-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <Link href={item.path} key={item.name} className="block group">
                            <div className="relative overflow-hidden rounded-xl transition-all duration-300">
                                {/* Active Background & Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-600"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}

                                {/* Hover Background */}
                                <div className={`absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'hidden' : ''}`} />

                                <div
                                    className={`relative flex items-center py-4 px-3 md:px-5 gap-4 ${isActive ? "text-orange-700" : "text-gray-600 group-hover:text-gray-900"
                                        }`}
                                >
                                    {/* Icon Container */}
                                    <div className={`p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-orange-100 shadow-sm' : 'bg-gray-100 group-hover:bg-white group-hover:shadow-sm'}`}>
                                        <Image
                                            src={item.icon}
                                            alt={`${item.name.toLowerCase()}_icon`}
                                            className={`w-5 h-5 md:w-6 md:h-6 object-contain transition-transform duration-300 group-hover:scale-110 ${isActive ? 'brightness-100' : 'opacity-70 group-hover:opacity-100'}`}
                                        />
                                    </div>

                                    {/* Text */}
                                    <span className={`md:block hidden font-medium text-sm md:text-base tracking-wide transition-all duration-300 ${isActive ? 'font-bold translate-x-1' : 'group-hover:translate-x-1'}`}>
                                        {item.name}
                                    </span>

                                    {/* Active Arrow (Desktop) */}
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="hidden md:block ml-auto"
                                        >
                                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Section (Optional decorative or info) */}
            <div className="mt-auto px-6 pb-8 hidden md:block">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-center shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Seller Dashboard</p>
                    <p className="text-white font-bold text-sm">QuickCart Admin</p>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
