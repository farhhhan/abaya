'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const ProductList = () => {

  const { router, products, productsLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");

  const bedProducts = products.filter(
    (p) => p?.category === "Bed" || p?.category === "Mattress" || p?.category === "Earphone");

  // Filter products based on search term
  const filteredProducts = bedProducts.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (productId, name) => {
    const confirmed = window.confirm(`Delete product "${name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "products", productId));
      toast.success("Product deleted");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-50 flex flex-col justify-between">
      {productsLoading ? <Loading /> : (
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Product List</h2>
              <p className="text-sm text-gray-600 mt-1">
                Total Products: <span className="font-semibold text-gray-900">{bedProducts.length}</span>
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full md:w-80 text-sm"
              />
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product, index) => {
                    const imageArray =
                      (Array.isArray(product.image) && product.image.length && product.image) ||
                      (Array.isArray(product.images) && product.images.length && product.images) ||
                      (Array.isArray(product.imageUrls) && product.imageUrls.length && product.imageUrls) ||
                      [];
                    const thumbnail = imageArray[0] || assets.upload_area;

                    return (
                      <tr
                        key={index}
                        className="bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 rounded-lg p-2 flex-shrink-0">
                              <Image
                                src={thumbnail}
                                alt="product Image"
                                className="w-16 h-16 object-cover rounded"
                                width={64}
                                height={64}
                              />
                            </div>
                            <span className="font-medium text-gray-900 truncate">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ₹{product.offerPrice}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => router.push(`/product/${product._id}`)}
                              className="flex items-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-xs hover:bg-orange-700 transition"
                            >
                              <span>Visit</span>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(product._id, product.name)}
                              className="px-3 py-2 border border-red-500 text-red-500 rounded-lg text-xs hover:bg-red-50 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="p-10 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg font-medium mb-1">No products found</p>
                <p className="text-sm">Try adjusting your search to find products</p>
              </div>
            )}
          </div>

          {/* Results Summary */}
          {filteredProducts.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{bedProducts.length}</span> products
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;