"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
const clampPercent = (val) => {
  const n = Number(val);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
};
const LayerEditor = ({
  value = { layerImageFile: null, layerImageUrl: "", layers: [] },
  onChange,
}) => {
  const {
    layerImageFile = null,
    layerImageUrl = "",
    layers = [],
  } = value || {};
  const [activeIndex, setActiveIndex] = useState(0);
  const previewSrc = layerImageFile
    ? URL.createObjectURL(layerImageFile)
    : layerImageUrl || assets.bed_layer;
  const updateValue = (patch) => {
    onChange({ ...value, ...patch });
  };
  const addLayer = () => {
    const nextId =
      (layers.length ? Math.max(...layers.map((l) => Number(l.id || 0))) : 0) +
      1;
    const newLayers = [
      ...layers,
      { id: nextId, title: "", description: "", x: 50, y: 50 },
    ];
    updateValue({ layers: newLayers });
    setActiveIndex(newLayers.length - 1);
  };
  const removeLayer = (index) => {
    const newLayers = layers
      .filter((_, i) => i !== index)
      .map((l, i) => ({ ...l, id: i + 1 }));
    updateValue({ layers: newLayers });
    setActiveIndex(Math.max(0, index - 1));
  };
  const updateLayer = (index, patch) => {
    const newLayers = layers.map((l, i) =>
      i === index ? { ...l, ...patch } : l
    );
    updateValue({ layers: newLayers });
  };
  return (
    <div className="space-y-5">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <p className="text-sm text-gray-600">
          Upload a layer image and add numbered points with title, description
          and position (x/y in %).
        </p>{" "}
        <button
          type="button"
          onClick={addLayer}
          className="px-3 py-1.5 bg-orange-600 text-white rounded"
        >
          Add Layer
        </button>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {" "}
        <div className="space-y-3">
          {" "}
          <label className="text-sm font-medium text-gray-700">
            Upload Layer Image
          </label>{" "}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              updateValue({ layerImageFile: e.target.files?.[0] || null })
            }
            className="block w-full text-sm"
          />{" "}
          <label className="text-sm font-medium text-gray-700">
            Or Paste Image URL
          </label>{" "}
          <input
            type="url"
            placeholder="https://..."
            value={layerImageUrl}
            onChange={(e) =>
              updateValue({
                layerImageUrl: e.target.value,
                layerImageFile: null,
              })
            }
            className="outline-none py-2.5 md:py-3 px-3.5 rounded-md border border-gray-300 text-base w-full"
          />{" "}
          <p className="text-xs text-gray-500">
            Tip: x and y are percentages of the image width/height (0-100).
            Markers update live as you edit.
          </p>{" "}
          <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            {" "}
            {previewSrc ? (
              <img
                src={previewSrc}
                alt="Layer preview"
                className="w-full h-auto object-contain"
              />
            ) : (
              <img
                src={assets.bed_layer}
                alt="Default layer"
                className="w-full h-auto object-contain"
              />
            )}{" "}
            {layers.map((l, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`absolute flex items-center justify-center h-8 w-8 rounded-full border shadow-sm transition-colors ${
                  activeIndex === idx
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-orange-600 border-orange-600"
                }`}
                style={{
                  left: `${clampPercent(l.x)}%`,
                  top: `${clampPercent(l.y)}%`,
                  transform: "translate(-50%, -50%)",
                }}
                aria-label={`Layer ${l.id || idx + 1}`}
              >
                {l.id || idx + 1}
              </button>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        <div className="space-y-4">
          {" "}
          {layers.length === 0 ? (
            <p className="text-xs text-gray-500">
              No layers added yet. Click "Add Layer" to create one.
            </p>
          ) : null}{" "}
          {layers.map((layer, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <p className="text-sm font-medium text-gray-700">
                  Layer #{layer.id || index + 1}
                </p>{" "}
                <button
                  type="button"
                  onClick={() => removeLayer(index)}
                  className="text-red-600 text-xs border border-red-600 px-2 py-1 rounded hover:bg-red-50"
                >
                  Remove
                </button>{" "}
              </div>{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {" "}
                <div className="space-y-2">
                  {" "}
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>{" "}
                  <input
                    type="text"
                    placeholder="Layer title"
                    value={layer.title || ""}
                    onChange={(e) =>
                      updateLayer(index, { title: e.target.value })
                    }
                    className="outline-none py-2.5 md:py-3 px-3.5 rounded-md border border-gray-300 text-base w-full"
                  />{" "}
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>{" "}
                  <textarea
                    rows={4}
                    placeholder="Describe this layer"
                    value={layer.description || ""}
                    onChange={(e) =>
                      updateLayer(index, { description: e.target.value })
                    }
                    className="outline-none py-2.5 md:py-3 px-3.5 rounded-md border border-gray-300 text-base w-full resize-none"
                  />{" "}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <label className="text-sm font-medium text-gray-700">
                    X Position (%)
                  </label>{" "}
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={layer.x ?? 50}
                    onChange={(e) =>
                      updateLayer(index, { x: clampPercent(e.target.value) })
                    }
                    className="outline-none py-2.5 md:py-3 px-3.5 rounded-md border border-gray-300 text-base w-full"
                  />{" "}
                  <label className="text-sm font-medium text-gray-700">
                    Y Position (%)
                  </label>{" "}
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={layer.y ?? 50}
                    onChange={(e) =>
                      updateLayer(index, { y: clampPercent(e.target.value) })
                    }
                    className="outline-none py-2.5 md:py-3 px-3.5 rounded-md border border-gray-300 text-base w-full"
                  />{" "}
                  <p className="text-xs text-gray-500">
                    Move the marker by editing X/Y, or click a marker to focus
                    this layer.
                  </p>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default LayerEditor;
