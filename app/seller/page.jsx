'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import FeaturesForm from "@/components/seller/FeaturesForm";
import LayerEditor from "@/components/seller/LayerEditor";

const AddProduct = () => {

  const [files, setFiles] = useState(Array(4).fill(null));
  const [imageLinks, setImageLinks] = useState("");
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Bed');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [features, setFeatures] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [layerConfig, setLayerConfig] = useState({ layerImageFile: null, layerImageUrl: "", layers: [] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || !offerPrice) {
      alert("Please fill in all required fields.");
      return;
    }

    const filteredFiles = files.filter(Boolean);
    const formattedLinks = imageLinks
      .split("\n")
      .map(link => link.trim())
      .filter(Boolean);

    if (!filteredFiles.length && !formattedLinks.length) {
      alert("Please provide at least one product image (upload or paste link).");
      return;
    }

    setIsSubmitting(true);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary environment variables are missing.");
      }

      const uploadToCloudinary = async (fileOrUrl) => {
        const formData = new FormData();
        formData.append("upload_preset", uploadPreset);
        formData.append("file", fileOrUrl);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || "Cloudinary upload failed");
        }
        return data.secure_url;
      };

      const uploadToCloudinaryAuto = async (fileOrUrl) => {
        const formData = new FormData();
        formData.append("upload_preset", uploadPreset);
        formData.append("file", fileOrUrl);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || "Cloudinary upload failed");
        }
        return data;
      };

      const uploadedFileUrls = await Promise.all(filteredFiles.map(file => uploadToCloudinary(file)));
      const uploadedLinkUrls = await Promise.all(formattedLinks.map(link => uploadToCloudinary(link)));
      const imageUrls = [...uploadedFileUrls, ...uploadedLinkUrls];

      const normalizedFeatures = await Promise.all((features || []).map(async (f, idx) => {
        let uploadRes = null;
        if (f.mediaFile) {
          uploadRes = await uploadToCloudinaryAuto(f.mediaFile);
        } else if (f.mediaUrl) {
          uploadRes = await uploadToCloudinaryAuto(f.mediaUrl);
        }
        const mediaUrl = uploadRes?.secure_url || f.mediaUrl || null;
        const mediaType = uploadRes?.resource_type || (/\.(mp4|webm|ogg)$/i.test(f.mediaUrl || "") ? "video" : "image");
        return {
          id: idx + 1,
          mediaUrl,
          mediaType,
          title: f.title || "",
          description: f.description || "",
          reversed: !!f.reversed,
        };
      }));
      const filteredFeatures = normalizedFeatures.filter((f) => f.mediaUrl || f.title || f.description);

      const normalizeLayerPos = (v) => {
        const n = Number(v);
        return Number.isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
      };

      let uploadedLayerImageUrl = null;
      if (layerConfig?.layerImageFile) {
        const res = await uploadToCloudinaryAuto(layerConfig.layerImageFile);
        uploadedLayerImageUrl = res?.secure_url || null;
      } else if (layerConfig?.layerImageUrl) {
        const res = await uploadToCloudinaryAuto(layerConfig.layerImageUrl);
        uploadedLayerImageUrl = res?.secure_url || null;
      }

      const layersData = (layerConfig?.layers || []).map((l, idx) => ({
        id: Number(l.id || idx + 1),
        title: l.title || "",
        description: l.description || "",
        x: normalizeLayerPos(l.x),
        y: normalizeLayerPos(l.y),
      }));

      await addDoc(collection(db, "products"), {
        name,
        description,
        category,
        price: Number(price),
        offerPrice: Number(offerPrice),
        image: imageUrls,
        imageUrls,
        features: filteredFeatures,
        layerImage: uploadedLayerImageUrl,
        layers: layersData,
        isAvailable: true,
        createdAt: serverTimestamp()
      });

      setName('');
      setDescription('');
      setCategory('Earphone');
      setPrice('');
      setOfferPrice('');
      setFiles(Array(4).fill(null));
      setImageLinks("");
      setLayerConfig({ layerImageFile: null, layerImageUrl: "", layers: [] });
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50 flex flex-col justify-between">
      <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 justify-items-start">
          <div className="text-center col-span-2">
            <p className="text-2xl font-semibold">Add Product</p>
            <p className="text-sm text-gray-500">Provide product details below.</p>
          </div>
          <div className="col-span-2 space-y-2">
            <p className="text-base font-medium text-center">Product Image</p>
            <div className="flex flex-wrap items-center justify-start gap-3 mt-2">

              {files.map((file, index) => (
                <label key={index} htmlFor={`image${index}`}>
                  <input onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files?.[0] || null;
                    setFiles(updatedFiles);
                  }} type="file" id={`image${index}`} hidden />
                  <Image
                    key={index}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md cursor-pointer"
                    src={file ? URL.createObjectURL(file) : assets.upload_area}
                    alt=""
                    width={60}
                    height={60}
                  />
                </label>
              ))}

            </div>
          </div>
          <div className="flex flex-col gap-2 col-span-2 max-w-lg w-full">
            <label className="text-base font-medium" htmlFor="image-links">
              Paste Image URLs (one per line)
            </label>
            <textarea
              id="image-links"
              rows={2}
              className="outline-none py-1.5 md:py-2 px-2.5 rounded-md border border-gray-300 text-sm resize-none"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              value={imageLinks}
              onChange={(e) => setImageLinks(e.target.value)}
            ></textarea>
            <p className="text-xs text-gray-500">We’ll copy remote images into Cloudinary automatically.</p>
          </div>
          <div className="flex flex-col gap-2 w-full md:max-w-[18rem]">
            <label className="text-base font-medium" htmlFor="product-name">
              Product Name
            </label>
            <input
              id="product-name"
              type="text"
              placeholder="Type here"
              className="outline-none py-1.5 md:py-2 px-2.5 rounded-md border border-gray-300 text-sm"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
          <div className="flex flex-col gap-2 col-span-2 max-w-lg w-full">
            <label
              className="text-base font-medium"
              htmlFor="product-description"
            >
              Product Description
            </label>
            <textarea
              id="product-description"
              rows={3}
              className="outline-none py-1.5 md:py-2 px-2.5 rounded-md border border-gray-300 text-sm resize-none"
              placeholder="Type here"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-2">
            <div className="flex flex-col gap-2 w-full md:max-w-[18rem]">
              <label className="text-base font-medium" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="outline-none py-1.5 md:py-2 px-2.5 rounded-md border border-gray-300 text-sm"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="Bed">Bed</option>
                <option value="Mattress">Mattress</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 w-full md:max-w-[18rem]">
              <label className="text-base font-medium" htmlFor="product-price">
                Product Price
              </label>
              <input
                id="product-price"
                type="number"
                placeholder="0"
                className="outline-none py-1.5 md:py-2 px-2.5 rounded-md border border-gray-300 text-sm"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                required
              />
            </div>
            <div className="flex flex-col gap-2 w-full md:max-w-[18rem]">
              <label className="text-base font-medium" htmlFor="offer-price">
                Offer Price
              </label>
              <input
                id="offer-price"
                type="number"
                placeholder="0"
                className="outline-none py-1.5 md:py-2 px-2.5 rounded-md border border-gray-300 text-sm"
                onChange={(e) => setOfferPrice(e.target.value)}
                value={offerPrice}
                required
              />
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-base font-medium text-center">Layer Breakdown</p>
            <LayerEditor value={layerConfig} onChange={setLayerConfig} />
          </div>
          <div className="col-span-2">
            <FeaturesForm features={features} setFeatures={setFeatures} />
          </div>
          <div className="col-span-2 flex justify-center gap-3 pt-4">
            <button
              type="submit"
              className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "ADD"}
            </button>
          </div>
        </form>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;