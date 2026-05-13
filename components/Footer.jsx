import React from "react";
import Link from "next/link";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 border-b border-white/20 pb-16">
          
          {/* Brand */}
          <div className="md:col-span-2 space-y-8">
            <div className="flex flex-col items-start">
              <span className="text-3xl font-black tracking-[0.4em] uppercase text-white leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                Abaya
              </span>
              <div className="w-12 h-[1px] bg-[#A38A6F] mt-1" />
            </div>
            <p className="text-gray-400 font-light text-sm max-w-sm leading-relaxed">
              A touch of elegance that reflects your personality. We offer designs that blend elegance with comfort.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.3em] font-heading font-medium">Quick Links</h3>
            <ul className="space-y-4 text-sm font-light text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/all-products" className="hover:text-white transition-colors">Collections</Link></li>
              <li><Link href="/journal" className="hover:text-white transition-colors">Journal</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.3em] font-heading font-medium">Customer Care</h3>
            <ul className="space-y-4 text-sm font-light text-gray-400">
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-gray-500 font-heading tracking-wider">
          <p>© {new Date().getFullYear()} ABAYA BOUTIQUE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors uppercase">Instagram</a>
            <a href="#" className="hover:text-white transition-colors uppercase">TikTok</a>
            <a href="#" className="hover:text-white transition-colors uppercase">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;