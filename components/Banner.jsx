import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-16 md:py-0 bg-muted my-24 overflow-hidden">
      <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left space-y-6 px-10 md:px-0 py-12">
        <h2 className="text-3xl md:text-5xl font-heading max-w-sm uppercase leading-tight tracking-wider text-black">
          Elegance in <br /> every stitch
        </h2>
        <p className="max-w-md font-body text-black/60 leading-relaxed italic">
          Discover a collection that blends traditional modesty with contemporary designs. Perfectly crafted for the modern woman.
        </p>
        <button onClick={() => window.location.href = '/all-products'} className="group flex items-center justify-center gap-3 px-12 py-4 bg-black text-white uppercase text-[11px] tracking-[0.3em] font-heading hover:bg-white hover:text-black transition-all border border-black">
          Shop The Collection
          <Image className="group-hover:translate-x-2 transition brightness-0 invert group-hover:invert-0" src={assets.arrow_icon_white} alt="arrow_icon_white" />
        </button>
      </div>
      <div className="relative w-full md:w-1/2 aspect-square md:aspect-[4/3] overflow-hidden">
        <Image
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?q=80&w=1200&auto=format&fit=crop"
          alt="Fashion Banner"
          width={1200}
          height={900}
        />
      </div>
    </div>
  );
};

export default Banner;