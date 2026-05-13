"use client";
import React, { useEffect, useState } from "react";

const FiltersSidebar = ({
  currencySymbol = "",
  min = 0,
  max = 0,
  valueMin,
  valueMax,
  categories = [],
  activeCategory = "",
  onApply,
  onClear,
  onCategoryChange,
  disabled = false,
}) => {
  const [localMin, setLocalMin] = useState(valueMin ?? min);
  const [localMax, setLocalMax] = useState(valueMax ?? max);

  useEffect(() => {
    setLocalMin(valueMin ?? min);
  }, [valueMin, min]);

  useEffect(() => {
    setLocalMax(valueMax ?? max);
  }, [valueMax, max]);

  const clamp = (val, lo, hi) => {
    const n = Number(val);
    if (Number.isNaN(n)) return lo;
    return Math.min(Math.max(n, lo), hi);
  };

  const handleApply = () => {
    const nextMin = clamp(localMin, min, max);
    const nextMax = clamp(localMax, min, max);
    if (typeof onApply === "function") onApply(Math.min(nextMin, nextMax), Math.max(nextMin, nextMax));
  };

  const handleClear = () => {
    if (typeof onClear === "function") onClear();
  };

  return (
    <aside className="w-full md:w-64 lg:w-72 xl:w-80 border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <h3 className="text-sm font-black uppercase tracking-[0.2em]">Boutique Filters</h3>
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          className="text-[10px] font-black uppercase tracking-widest text-[#A38A6F] hover:underline disabled:opacity-50"
        >
          Reset
        </button>
      </div>

      <div className="space-y-10">
        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Collections</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onCategoryChange("")}
                className={`text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!activeCategory ? "bg-black text-white shadow-xl" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
              >
                All Series
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory.toLowerCase() === cat.toLowerCase() ? "bg-black text-white shadow-xl" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Price Range Section */}
        <div className="space-y-6 pt-6 border-t border-gray-50">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Valuation Range</p>
            <p className="text-xs font-black text-gray-900">{currencySymbol}{min.toLocaleString()} — {currencySymbol}{max.toLocaleString()}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Min</label>
              <input
                type="number"
                value={localMin}
                onChange={(e)=>setLocalMin(e.target.value)}
                min={min}
                max={max}
                disabled={disabled}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-black outline-none focus:bg-white focus:border-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Max</label>
              <input
                type="number"
                value={localMax}
                onChange={(e)=>setLocalMax(e.target.value)}
                min={min}
                max={max}
                disabled={disabled}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-black outline-none focus:bg-white focus:border-black transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            disabled={disabled}
            className="w-full bg-black text-white rounded-xl py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#1C1C1C] transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            Apply Range
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;