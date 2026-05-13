"use client";
import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";

const DEFAULT_LAYERS = [
  {
    id: 1,
    title: "Breathable Cover",
    description:
      "Soft, air-flow knit cover that keeps the surface cool and comfortable while wicking away moisture.",
    x: 88,
    y: 18,
  },
  {
    id: 2,
    title: "Cooling Comfort Foam",
    description:
      "Open-cell foam engineered for temperature regulation and plush comfort without trapping heat.",
    x: 88,
    y: 30,
  },
  {
    id: 3,
    title: "Pressure-Relief Memory Foam",
    description:
      "Contours to your body to relieve pressure points around shoulders and hips for restorative sleep.",
    x: 88,
    y: 38,
  },
  {
    id: 4,
    title: "Aeroflex® Spring System",
    description:
      "Individually wrapped springs provide responsive support and motion isolation so partners don’t disturb each other.",
    x: 88,
    y: 45,
  },
  {
    id: 5,
    title: "Support Transition Layer",
    description:
      "High-resilience layer balances contouring above with deep support below for neutral spinal alignment.",
    x: 88,
    y: 55,
  },
  {
    id: 6,
    title: "Anti-Slip Base",
    description:
      "Sturdy, grippy base keeps the mattress in place and enhances durability for years of comfort.",
    x: 88,
    y: 70,
  },
];

const LayerBreakdown = ({ image = assets.bed_layer || assets.bed_layer, layers = DEFAULT_LAYERS }) => {
  const [activeId, setActiveId] = useState(layers[0]?.id ?? null);
  const active = layers.find((l) => l.id === activeId) || layers[0];

  return (
    <section className="mt-16">
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
        <div className="px-6 md:px-10 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800">Find out why the Hybrid is loved the world over</h2>
            <p className="text-gray-500 mt-1">Take a look under the covers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Image with numbered markers */}
            <div className="relative">
              <Image
                src={image}
                alt="mattress layers"
                className="w-full h-auto object-contain"
                width={1280}
                height={720}
                priority
              />

              {layers.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setActiveId(l.id)}
                  className={`absolute flex items-center justify-center h-8 w-8 rounded-full border shadow-sm transition-colors ${activeId === l.id ? "bg-orange-600 text-white border-orange-600" : "bg-white text-orange-600 border-orange-600"}`}
                  style={{ left: `${l.x}%`, top: `${l.y}%`, transform: "translate(-50%, -50%)" }}
                  aria-label={`Layer ${l.id}`}
                >
                  {l.id}
                </button>
              ))}
            </div>

            {/* Details panel with vertical number selector */}
            <div className="flex md:pl-6">


              <div>
                <p className="text-xs tracking-wide text-gray-500 uppercase">Layer {active.id}</p>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mt-1">{active.title}</h3>
                <p className="text-gray-600 mt-3 max-w-xl">{active.description}</p>

                {/* Layer options shown under details on all sizes */}
                <div className="flex items-center gap-2 mt-6 flex-wrap">
                  {layers.map((l) => (
                    <button
                      key={`m-dot-${l.id}`}
                      onClick={() => setActiveId(l.id)}
                      className={`h-8 w-8 rounded-full border flex items-center justify-center transition-colors ${activeId === l.id ? "bg-orange-600 text-white border-orange-600" : "bg-white text-orange-600 border-orange-600"}`}
                      aria-label={`Select layer ${l.id}`}
                    >
                      {l.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LayerBreakdown;