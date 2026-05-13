import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";

const ProductCard = ({ product }) => {
    const { currencySymbol, router, resolvePrice, addToWishlist, removeFromWishlist, isInWishlist } = useAppContext();

    if (!product) return null;

    const isWishlisted = isInWishlist(product._id);

    const toggleWishlist = (e) => {
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product._id);
        }
    };

    const resolvedPrice = resolvePrice(product);
    const originalPrice = Number(product.price || 0);

    const productImages =
        (Array.isArray(product.image) && product.image.length && product.image) ||
        (Array.isArray(product.images) && product.images.length && product.images) ||
        (Array.isArray(product.imageUrls) && product.imageUrls.length && product.imageUrls) ||
        [];

    const thumbnail = productImages[0] || assets.upload_area;

    const handleNavigate = () => {
        if (!product?._id) return;
        router.push('/product/' + product._id);
    };

    return (
        <motion.div
            onClick={handleNavigate}
            className="flex flex-col items-start gap-5 w-full cursor-pointer group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            {/* Visual Container */}
            <div className="relative aspect-[3/4.2] w-full bg-[#f8f8f8] overflow-hidden rounded-[32px] border border-gray-100/50 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-gray-200">
                {/* Primary Image */}
                <Image
                    src={thumbnail}
                    alt={product.name || "product"}
                    className={`transition-all duration-1000 object-cover w-full h-full mix-blend-multiply ${productImages.length > 1 ? 'group-hover:opacity-0 group-hover:scale-110' : 'group-hover:scale-110'}`}
                    width={800}
                    height={1120}
                />
                
                {/* Secondary Hover Image */}
                {productImages.length > 1 && (
                    <Image
                        src={productImages[1]}
                        alt={`${product.name || "product"} hover view`}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-110 transition-all duration-1000"
                        width={800}
                        height={1120}
                    />
                )}
                
                {/* Luxury Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.isBestSeller && (
                        <div className="bg-black text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            Bestseller
                        </div>
                    )}
                    {product.offerPrice < product.price && (
                        <div className="bg-amber-500 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            Spotlight
                        </div>
                    )}
                </div>

                {/* Interactive Controls */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-6 right-6 flex flex-col gap-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button className="p-4 bg-white text-black rounded-full shadow-2xl hover:bg-black hover:text-white transition-all transform hover:scale-110">
                        <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={toggleWishlist}
                        className={`p-4 backdrop-blur-md rounded-full shadow-2xl transition-all transform hover:scale-110 ${isWishlisted ? "bg-red-500 text-white" : "bg-white/80 text-red-500 hover:bg-red-500 hover:text-white"}`}
                    >
                        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Metadata */}
            <div className="w-full flex flex-col space-y-2 px-2">
                <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                        {product.category?.[0] || "Luxury Item"}
                    </p>
                    <div className="flex gap-1">
                        {product.variants?.slice(0, 3).map((v, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full border border-gray-100" style={{ backgroundColor: v.hex }} />
                        ))}
                    </div>
                </div>
                <h3 className="text-sm font-black tracking-tight text-gray-900 group-hover:text-[#A38A6F] transition-colors duration-300">
                    {product.name || "Artisan Piece"}
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-gray-900 tracking-tight">
                        {currencySymbol}{resolvedPrice.toLocaleString()}
                    </span>
                    {originalPrice > resolvedPrice && (
                        <span className="text-xs font-bold text-gray-300 line-through">
                            {currencySymbol}{originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default ProductCard;
