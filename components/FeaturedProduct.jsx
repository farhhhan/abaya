import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const products = [
  {
    id: 1,
    image: assets.featured1,
    title: "Signature Abayas",
    description: "Discover our most-loved signature designs.",
  },
  {
    id: 2,
    image: assets.featured2,
    title: "The Evening Edit",
    subtitle: "Elegance redefined for your special moments.",
    description: "Step into the spotlight with our evening collection.",
  },
  {
    id: 3,
    image: assets.featured3,
    title: "Ethereal Silk",
    description: "Experience the ultimate luxury of pure silk.",
  },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-24">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-heading mb-12 tracking-widest uppercase">The Highlights</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 mt-8">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative group cursor-pointer overflow-hidden">
            <div className="aspect-[4/5] overflow-hidden bg-muted">
              <Image
                src={image}
                alt={title}
                className="group-hover:scale-110 transition duration-700 w-full h-full object-cover"
                width={600}
                height={750}
              />
            </div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
            <div className="absolute bottom-10 left-10 text-white space-y-3 pr-10">
              <h3 className="font-heading text-2xl lg:text-3xl tracking-wide uppercase leading-tight">{title}</h3>
              <p className="text-xs lg:text-sm font-body opacity-90 leading-relaxed max-w-xs">
                {description}
              </p>
              <button className="flex items-center gap-3 uppercase text-[10px] tracking-[0.2em] font-heading border-b border-white pb-1 hover:opacity-60 transition-opacity">
                Explore More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;