"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";


const Navbar = () => {
  const { isSeller, router, getCartCount, products, productsLoading, currency, isSignedIn, userData, signInWithGoogle, logout } = useAppContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText.trim()), 250);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSearchOpen(false);
        setHighlightIndex(-1);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalize = (v) => (v || "").toString().toLowerCase();
  const q = normalize(debouncedSearch);
  const matchedProducts = q
    ? products.filter((p) =>
      [p?.name, p?.category, p?.description].some((v) =>
        normalize(v).includes(q)
      )
    )
    : [];
  const suggestions = matchedProducts.slice(0, 8);

  const getThumb = (p) => {
    const imgs =
      (Array.isArray(p.image) && p.image.length && p.image) ||
      (Array.isArray(p.images) && p.images.length && p.images) ||
      (Array.isArray(p.imageUrls) && p.imageUrls.length && p.imageUrls) ||
      [];
    return imgs[0] || assets.upload_area;
  };

  const onKeyDownSearch = (e) => {
    if (e.key === "Escape") {
      setSearchOpen(false);
      setHighlightIndex(-1);
      return;
    }
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && suggestions[highlightIndex]) {
        e.preventDefault();
        const sel = suggestions[highlightIndex];
        router.push("/product/" + sel._id);
        setSearchOpen(false);
        setHighlightIndex(-1);
        setSearchText("");
      }
    }
  };
  
  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchText.trim();
    if (!q) return;
    router.push(`/all-products?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setHighlightIndex(-1);
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-5 border-b border-gray-100 text-black font-body bg-white z-50 h-24">
      {/* Search Section */}
      <div className="flex-1 flex items-center gap-4">
        <button 
          type="button" 
          onClick={() => setMobileMenuOpen(true)} 
          className="md:hidden hover:opacity-60 transition p-2 -ml-2"
        >
          <Image className="w-6 h-6" src={assets.menu_icon} alt="menu icon" />
        </button>

        <button type="button" onClick={() => setSearchOpen((o) => !o)} aria-label="Open search" className="hover:opacity-60 transition max-md:hidden">
          <Image className="w-5 h-5" src={assets.search_icon} alt="search icon" />
        </button>
        {searchOpen && (
          <div ref={containerRef} className="absolute top-full left-0 w-full bg-white border-b shadow-xl p-6 animate-in slide-in-from-top duration-300 z-[100]">
            <form onSubmit={submitSearch} className="max-w-3xl mx-auto flex items-center gap-6">
              <input
                type="text"
                value={searchText}
                autoFocus
                onChange={(e) => { setSearchText(e.target.value); setHighlightIndex(-1); }}
                onKeyDown={onKeyDownSearch}
                placeholder="Find your perfect abaya..."
                className="flex-1 outline-none text-2xl py-3 border-b border-black font-heading font-light tracking-wide"
              />
              <button type="submit" className="uppercase text-xs tracking-[0.3em] font-heading border-b border-black pb-1 hover:opacity-50 transition-opacity">Search</button>
            </form>
            {q && !productsLoading && suggestions.length > 0 && (
              <div className="max-w-3xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                {suggestions.map((p, idx) => (
                  <button
                    key={p._id || idx}
                    type="button"
                    onClick={() => { router.push("/product/" + p._id); setSearchOpen(false); setHighlightIndex(-1); setSearchText(""); }}
                    className="group text-left"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-muted mb-3 relative">
                       <Image src={getThumb(p)} alt={p.name} width={200} height={266} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.15em] font-heading truncate opacity-70 group-hover:opacity-100 transition-opacity">{p.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div 
        className="flex-shrink-0 absolute left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-black tracking-[0.4em] uppercase text-black leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
            Abaya
          </span>
          <div className="w-12 h-[1px] bg-[#A38A6F] mt-1" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end gap-10">
        <div className="flex items-center gap-10 max-md:hidden uppercase text-[10px] tracking-[0.25em] font-heading mr-12 text-black/70">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="/all-products" className="hover:text-black transition-colors">Collections</Link>
          <Link href="/journal" className="hover:text-black transition-colors font-bold text-[#A38A6F]">Journal</Link>
          <Link href="/about" className="hover:text-black transition-colors">About</Link>
          <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push("/cart")}
            className="relative hover:opacity-60 transition"
          >
            <Image className="w-5 h-5" src={assets.cart_icon} alt="cart icon" />
            {getCartCount && getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </button>
          
          <div className="relative" ref={userMenuRef}>
            {isSignedIn ? (
              <button 
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 hover:ring-2 hover:ring-black/20 transition-all focus:outline-none"
              >
                {userData?.photoURL ? (
                  <Image src={userData.photoURL} alt={userData.name || 'User'} width={32} height={32} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] font-black tracking-widest uppercase">
                    {(userData?.name || 'U').charAt(0)}
                  </div>
                )}
              </button>
            ) : (
              <button 
                className="hover:opacity-60 transition" 
                onClick={signInWithGoogle}
              >
                <Image className="w-5 h-5" src={assets.user_icon} alt="user icon" />
              </button>
            )}

            {/* User Dropdown Menu */}
            {userMenuOpen && isSignedIn && (
               <div className="absolute top-12 right-0 w-48 bg-white border border-gray-100 shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest truncate">{userData?.name}</p>
                    <p className="text-[8px] font-bold text-gray-400 truncate">{userData?.email}</p>
                  </div>
                  <button onClick={() => { setUserMenuOpen(false); router.push("/account"); }} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors">My Account</button>
                  <button onClick={() => { setUserMenuOpen(false); router.push("/wishlist"); }} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors">Wishlist</button>
                  <button onClick={() => { setUserMenuOpen(false); router.push("/my-orders"); }} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors">My Orders</button>
                  <button onClick={() => { setUserMenuOpen(false); logout(); }} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#A38A6F] hover:bg-gray-50 transition-colors mt-2 border-t border-gray-50">Sign Out</button>
               </div>
            )}
          </div>

        </div>
      </div>
      {/* Mobile Menu Sidebar */}
      <div className={`fixed top-0 left-0 bottom-0 overflow-hidden bg-white z-[200] transition-all duration-500 shadow-2xl ${mobileMenuOpen ? 'w-full' : 'w-0'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-8 border-b border-gray-50">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black tracking-[0.4em] uppercase text-black leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                Abaya
              </span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:opacity-60 transition"
            >
              <Image src={assets.arrow_icon} className="w-6 h-6 rotate-180" alt="close menu" />
            </button>
          </div>
          
          <div className="flex flex-col p-10 gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A38A6F] mb-4">Discovery</p>
            {[
              { label: 'Home', path: '/' },
              { label: 'Collections', path: '/all-products' },
              { label: 'Journal', path: '/journal' },
              { label: 'About Boutique', path: '/about' },
              { label: 'Contact', path: '/contact' }
            ].map((link, i) => (
              <Link 
                key={i}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-heading uppercase tracking-tight text-gray-900 hover:text-[#A38A6F] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto p-10 bg-gray-50/50 space-y-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Artisan Assistance</p>
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">Global Boutique Care</p>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Indulge in Modest Luxury, Crafted with Precision.</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
