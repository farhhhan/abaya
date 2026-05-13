import React from 'react';
import Image from 'next/image';
import FadeIn from './FadeIn';

const LifestyleBanner = ({ imageSrc }) => {
  return (
    <section className="bg-[#1A1A1A] text-white py-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-20">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          {/* Image Container */}
          <FadeIn delay={0.1} className="w-full md:w-1/2" fullWidth={true}>
            <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden shadow-2xl rounded-sm">
              <Image
                src={imageSrc}
                alt="Lifestyle"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </FadeIn>

          {/* Text Container */}
          <FadeIn delay={0.2} className="w-full md:w-1/2 space-y-8" fullWidth={true}>
            <h2 className="text-3xl md:text-5xl font-heading leading-tight tracking-tight uppercase">
              A touch of elegance that reflects your personality
            </h2>
            <div className="space-y-4 text-gray-400 font-light">
                <p className="text-sm md:text-lg leading-relaxed max-w-lg">
                    We offer designs that blend elegance with comfort, so you feel confident and stylish every day. Our goal is to be your first choice for modern fashion.
                </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default LifestyleBanner;
