import React from "react";
import { formatPair } from "@/lib/units";

const UnitPill = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1 rounded-full border text-sm ${active ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-300"}`}
  >
    {label}
  </button>
);

const SizeSelector = ({ unit = "in", setUnit, sizesInches = [], selectedSizeIn, onSelectSize }) => {
  const units = ["in", "ft", "cm"];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-600 block">Select Size</label>

      <div className="flex items-center gap-2 mb-2">
        {units.map((u) => (
          <UnitPill key={u} label={u} active={unit === u} onClick={() => setUnit(u)} />
        ))}
      </div>

      <div className="p-3 rounded bg-orange-50">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sizesInches.map((pair, idx) => {
            const checked = Array.isArray(selectedSizeIn) && selectedSizeIn[0] === pair[0] && selectedSizeIn[1] === pair[1];
            return (
              <label key={`${pair[0]}x${pair[1]}_${idx}`} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="size-options"
                  checked={checked}
                  onChange={() => onSelectSize(pair)}
                />
                <span>{formatPair(pair, unit)}</span>
              </label>
            );
          })}
          {!sizesInches.length && (
            <span className="text-sm text-gray-500">No sizes available</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SizeSelector;