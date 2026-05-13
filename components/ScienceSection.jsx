import React from "react";
import { assets } from "@/assets/assets";

const FALLBACK_FEATURES = [
  {
    id: 1,
    image: assets.side_pain,
    mediaType: "image",
    title: "Lower Temperatures Help You Sleep Better",
    description:
      "Emma Hybrid’s Coolgel-infused memory foam, breathable Airgocell, and heat-dissipating Aeroflex springs swiftly eliminate excess body heat. Achieve your ideal sleep temperature faster, fall asleep quicker, and stay asleep longer.",
    reversed: false,
  },
  {
    id: 2,
    image: assets.air_flow,
    mediaType: "image",
    title: "Optimized for Deep Sleep",
    description:
      "The Emma Hybrid masters the art of temperature regulation and precise support. Superior orthopedic support from HALO® foam and breathability from Airgocell® provide the perfect conditions for deep rest.",
    reversed: true,
  },
  {
    id: 3,
    image: assets.sleep_side,
    mediaType: "image",
    title: "The Hug-Like Experience",
    description:
      "Emma Hybrid combines adaptive memory foam with motion-absorbing pocket springs (independent helix) for optimized support. Firm support for high-pressure areas, soft comfort everywhere else. Unleash the future of personalized sleep.",
    reversed: false,
  },
  {
    id: 4,
    image: assets.surface,
    mediaType: "image",
    title: "Chill Dreams Await",
    description:
      "The Emma Hybrid's innovative CoolGel granules and breathable Airgocell foam work together to keep you sweat-free and cool. Say goodbye to restless nights!",
    reversed: true,
  },
];

const isVideoUrl = (url = "") => /\.(mp4|webm|ogg)$/i.test(url);

const ScienceSection = ({ features = [] }) => {
  const data = Array.isArray(features) && features.length ? features : FALLBACK_FEATURES;

  return (
    <section className="mt-16 md:mt-20">
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
        <div className="px-6 md:px-10 py-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800">
              Backed By Science
            </h2>
            <p className="text-gray-500 mt-1">
              Cutting-edge Technologies to Improve Sleep
            </p>
          </div>

          <div className="space-y-12">
            {data.map((item, idx) => {
              const src = item.mediaUrl || item.image?.src || item.image || "";
              const mediaType = item.mediaType || (isVideoUrl(src) ? "video" : "image");
              const reversed = item.reversed !== undefined ? !!item.reversed : idx % 2 === 1;
              const key = item.id || idx;

              return (
                <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
                  <div className={reversed ? "md:order-2" : ""}>
                    <div className="aspect-[16/9] md:aspect-[3/2] rounded-2xl overflow-hidden bg-gray-50 ring-1 ring-gray-200 shadow">
                      {mediaType === "video" ? (
                        <video src={src} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                      ) : (
                        <img src={src} alt={item.title || "Feature media"} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </div>

                  <div className={`${reversed ? "md:order-1" : ""} space-y-3 md:space-y-4 md:px-2 max-w-xl`}>
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mt-3 max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScienceSection;
