"use client";
import React from "react";
import HomeProducts from "@/components/HomeProducts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import NewCollectionSlider from "@/components/NewCollectionSlider";
import LifestyleBanner from "@/components/LifestyleBanner";
import { assets } from "@/assets/assets";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const Home = () => {
  const { products, productsLoading } = useAppContext();

  // Dynamically compute categories and unique images
  const categoriesData = React.useMemo(() => {
    if (productsLoading || !products.length) return [];

    const categoryMap = {};
    
    products.forEach(product => {
      const cats = Array.isArray(product.category) ? product.category : [product.category];
      cats.forEach(cat => {
        if (!cat) return;
        if (!categoryMap[cat]) {
          categoryMap[cat] = {
            name: cat,
            images: [],
            link: `/all-products?category=${encodeURIComponent(cat)}`
          };
        }
        if (product.image && product.image.length > 0) {
          categoryMap[cat].images.push(...product.image);
        }
      });
    });

    return Object.values(categoryMap).map(catData => {
      // Pick a random image from the category's product images
      const randomImg = catData.images.length > 0 
        ? catData.images[Math.floor(Math.random() * catData.images.length)]
        : assets.upload_area;
      
      return {
        name: catData.name,
        img: randomImg,
        link: catData.link,
        count: 'Collection'
      };
    }).slice(0, 6); // Limit to top 6 categories for UI balance
  }, [products, productsLoading]);

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-body text-[#121212]">
      <Navbar />
      {/* Hero Section: Fixed Parallax Window */}
      <section className="relative w-full h-[60vh] md:h-[65vh] flex flex-col md:flex-row overflow-hidden bg-[#E2E2E2]">

        {/* Left Image Panel */}
        <div
          className="w-full h-1/2 md:h-full md:w-1/2 bg-fixed bg-no-repeat"
          style={{
            backgroundImage: `url(${assets.new_abaya_hero_2.src || assets.new_abaya_hero_2})`,
            backgroundSize: 'contain',
            backgroundPosition: 'left center',
            backgroundColor: '#f4f4f4'
          }}
        />

        {/* Right Image Panel */}
        <div
          className="w-full h-1/2 md:h-full md:w-1/2 bg-fixed bg-no-repeat border-t md:border-t-0 md:border-l border-black/5"
          style={{
            backgroundImage: `url(${assets.new_abaya_hero_1.src || assets.new_abaya_hero_1})`,
            backgroundSize: 'contain',
            backgroundPosition: 'right center',
            backgroundColor: '#f4f4f4'
          }}
        />
      </section>

      {/* Main Content: This layer scrolls OVER the hero parallax */}
      <main className="relative z-10 bg-white w-full shadow-[0_-10px_50px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-20 pb-24 space-y-24">
          {/* Shop By Category Section */}
          <FadeIn delay={0.1}>
            <section className="space-y-16">
              <div className="flex flex-col items-center text-center space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A38A6F]">
                   Curated Collections
                </span>
                <h2 className="text-3xl md:text-5xl font-heading tracking-tight uppercase">Shop by category</h2>
                <div className="w-12 h-[1px] bg-black"></div>
              </div>

              {productsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   {[1,2,3].map(i => (
                     <div key={i} className="aspect-[3/4.2] bg-gray-100 animate-pulse rounded-sm" />
                   ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-10">
                  {categoriesData.map((category, idx) => (
                    <FadeIn 
                      delay={idx * 0.1} 
                      direction="up" 
                      blur={true} 
                      key={idx} 
                      className="w-full"
                    >
                      <Link href={category.link} className="group relative flex flex-col items-center">
                        <div className="relative w-full aspect-[3/4.2] overflow-hidden bg-gray-50 mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                          <Image
                            src={category.img}
                            alt={category.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700"></div>
                          
                          {/* Animated Category Overlay */}
                          <div className="absolute inset-0 border-[0px] group-hover:border-[1px] border-white/30 transition-all duration-500 m-4"></div>
                          
                          {/* Modern Category Badge */}
                          <div className="absolute top-6 left-6 overflow-hidden">
                            <span className="inline-block translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/95 backdrop-blur-md px-5 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-900">
                                {category.count}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-3">
                          <h3 className="text-sm md:text-lg font-heading tracking-[0.2em] uppercase group-hover:tracking-[0.3em] transition-all duration-700 text-gray-800">
                            {category.name}
                          </h3>
                          <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                              <div className="w-12 h-[1px] bg-[#A38A6F]"></div>
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A38A6F]">Explore</span>
                          </div>
                        </div>
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              )}
            </section>
          </FadeIn>
        </div>

        {/* Lifestyle Banner Section - with directional entrance */}
        <FadeIn direction="left" delay={0.1} fullWidth={true}>
            <LifestyleBanner imageSrc={assets.abaya_lifestyle} />
        </FadeIn>

        {/* Full Width New Collection Slider */}
        <FadeIn delay={0.2}>
          <NewCollectionSlider />
        </FadeIn>

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-24">
          {/* You can add more sections here if needed */}
        </div>
      </main>

      {/* Bottom Parallax Reveal Effect */}
      <section
        className="relative w-full h-[60vh] md:h-[70vh] bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${assets.timeless_elegance_abaya.src})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white text-3xl md:text-5xl font-heading uppercase tracking-[0.4em] text-center px-4 leading-tight drop-shadow-lg">
            Timeless<br />Elegance
          </h2>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;