"use client";
import React from "react";
const defaultFeature = {
  mediaFile: null,
  mediaUrl: "",
  title: "",
  description: "",
  reversed: false,
};
const FeaturesForm = ({ features = [], setFeatures }) => {
  const addFeature = () => {
    setFeatures([...features, { ...defaultFeature }]);
  };
  const removeFeature = (index) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated);
  };
  const updateFeature = (index, patch) => {
    const updated = features.map((f, i) =>
      i === index ? { ...f, ...patch } : f
    );
    setFeatures(updated);
  };
  return (
    <div className="space-y-5">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <p className="text-sm text-gray-600">
          Add blocks with media (image/webp/mp4), title, and description.
        </p>{" "}
        <button
          type="button"
          onClick={addFeature}
          className="px-3 py-1.5 bg-orange-600 text-white rounded"
        >
          Add Feature
        </button>{" "}
      </div>{" "}
      {features.length === 0 ? (
        <p className="text-xs text-gray-500">No features added yet.</p>
      ) : null}{" "}
      <div className="space-y-6 md:max-w-3xl w-full">
        {" "}
        {features.map((feature, index) => {
          const previewSrc = feature.mediaFile
            ? URL.createObjectURL(feature.mediaFile)
            : feature.mediaUrl || "";
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 space-y-5"
            >
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <p className="text-sm font-medium text-gray-700">
                  Feature #{index + 1}
                </p>{" "}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 text-xs border border-red-600 px-2 py-1 rounded hover:bg-red-50"
                >
                  Remove
                </button>{" "}
              </div>{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {" "}
                <div className="space-y-2">
                  {" "}
                  <label className="text-sm font-medium text-gray-700">
                    Upload Media
                  </label>{" "}
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) =>
                      updateFeature(index, {
                        mediaFile: e.target.files?.[0] || null,
                      })
                    }
                    className="block w-full text-sm"
                  />{" "}
                  <p className="text-xs text-gray-500">
                    Supported: images (jpeg/png/webp) and videos (mp4/webm). If
                    you prefer, paste a media URL below.
                  </p>{" "}
                  <label className="text-sm font-medium text-gray-700">
                    Or Paste Media URL
                  </label>{" "}
                  <input
                    type="url"
                    placeholder="https://..."
                    value={feature.mediaUrl}
                    onChange={(e) =>
                      updateFeature(index, { mediaUrl: e.target.value })
                    }
                    className="outline-none py-2.5 md:py-3 px-3.5 rounded-md border border-gray-300 text-base w-full"
                  />{" "}
                </div>{" "}
                <div className="space-y-2">
                  {" "}
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>{" "}
                  <input
                    type="text"
                    placeholder="Feature title"
                    value={feature.title}
                    onChange={(e) =>
                      updateFeature(index, { title: e.target.value })
                    }
                    className="outline-none py-2.5 md:py-3 px-3.5 rounded-md border border-gray-300 text-base w-full"
                  />{" "}
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>{" "}
                  <textarea
                    rows={5}
                    placeholder="Describe the feature"
                    value={feature.description}
                    onChange={(e) =>
                      updateFeature(index, { description: e.target.value })
                    }
                    className="outline-none py-2.5 md:py-3 px-3.5 rounded-md border border-gray-300 text-base w-full resize-none"
                  />{" "}
                  <label className="inline-flex items-center gap-2 text-sm">
                    {" "}
                    <input
                      type="checkbox"
                      checked={feature.reversed}
                      onChange={(e) =>
                        updateFeature(index, { reversed: e.target.checked })
                      }
                    />{" "}
                    <span>Reverse layout (image on right)</span>{" "}
                  </label>{" "}
                </div>{" "}
              </div>{" "}
              {previewSrc ? (
                <div className="flex flex-wrap justify-start gap-3">
                  {" "}
                  {/\.(mp4|webm|ogg)$/i.test(previewSrc) ? (
                    <video
                      src={previewSrc}
                      className="w-64 h-48 md:w-80 md:h-56 object-cover rounded-lg"
                      controls
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={previewSrc}
                      alt={feature.title || "Feature media"}
                      className="w-64 h-48 md:w-80 md:h-56 object-cover rounded-lg"
                    />
                  )}{" "}
                </div>
              ) : null}{" "}
            </div>
          );
        })}{" "}
      </div>{" "}
    </div>
  );
};
export default FeaturesForm;
