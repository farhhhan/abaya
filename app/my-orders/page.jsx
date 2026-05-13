'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { collection, getDocs, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import ReviewModal from "@/components/ReviewModal";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Package, 
    Clock, 
    MapPin, 
    ChevronRight, 
    Scissors, 
    Star, 
    FileText, 
    ShoppingBag,
    CheckCircle2,
    Truck,
    XCircle,
    Info
} from "lucide-react";

const MyOrders = () => {
    const { currencySymbol, userData, isSignedIn } = useAppContext();
    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [userReviews, setUserReviews] = useState({});
    const [loading, setLoading] = useState(true);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const fetchOrders = async () => {
        if (!userData) return;
        try {
            const q = query(
                collection(db, "orders"),
                where("userId", "==", userData.id)
            );
            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            ordersData.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                return dateB - dateA;
            });

            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        if (isSignedIn && userData) {
            const q = query(
                collection(db, "orders"),
                where("userId", "==", userData.id)
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                ordersData.sort((a, b) => {
                    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
                    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
                    return dateB - dateA;
                });

                setOrders(ordersData);
                setLoading(false);
            }, (error) => {
                console.error("Error listening to orders:", error);
                setLoading(false);
            });

            // Listen to reviews
            const reviewsQ = query(
                collection(db, "reviews"),
                where("userId", "==", userData.id)
            );

            const unsubscribeReviews = onSnapshot(reviewsQ, (reviewSnapshot) => {
                const reviewsMap = {};
                reviewSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    // Store review using orderId + productId to be specific
                    reviewsMap[`${data.orderId}_${data.productId}`] = data;
                });
                setUserReviews(reviewsMap);
            });

            return () => {
                unsubscribe();
                unsubscribeReviews();
            };
        } else {
            setLoading(false);
        }
    }, [userData, isSignedIn]);

    const handleReviewClick = (item, orderId) => {
        setSelectedProduct(item);
        setSelectedOrderId(orderId);
        setReviewModalOpen(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'Cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'Shipped': return <Truck className="w-4 h-4 text-blue-500" />;
            default: return <Clock className="w-4 h-4 text-[#A38A6F]" />;
        }
    };

    return (
        <div className="bg-[#FDFDFD] min-h-screen font-['Outfit']">
            <Navbar />
            
            {/* Header Section */}
            <div className="bg-[#1C1C1C] py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#A38A6F]/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <p className="text-[10px] font-black text-[#A38A6F] uppercase tracking-[0.5em]">Private Gallery</p>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">Your Orders</h1>
                        <div className="w-20 h-1 bg-[#A38A6F]" />
                    </motion.div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-20 px-6">
                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <Loading />
                    </div>
                ) : (
                    <div className="space-y-12">
                        {orders.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-40 space-y-8"
                            >
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-[40px] border border-gray-100 mb-4">
                                    <ShoppingBag className="w-10 h-10 text-gray-200" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Gallery is Empty</h2>
                                    <p className="text-gray-400 text-sm font-medium uppercase tracking-widest">You have not acquired any artisan pieces yet.</p>
                                </div>
                                <button 
                                    onClick={() => router.push('/all-products')} 
                                    className="px-10 py-4 bg-[#1C1C1C] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#A38A6F] transition-all"
                                >
                                    Begin Discovery
                                </button>
                            </motion.div>
                        ) : (
                            orders.map((order, index) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative bg-white rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-100 transition-all duration-700 overflow-hidden"
                                >
                                    {/* Order Meta Header */}
                                    <div className="bg-[#FAFAFA] border-b border-gray-100 px-10 py-8 flex flex-wrap items-center justify-between gap-8">
                                        <div className="flex items-center gap-10">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Order Established</p>
                                                <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{new Date(order.date).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Collection Value</p>
                                                <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{currencySymbol}{order.amount.toFixed(2)}</p>
                                            </div>
                                            <div className="space-y-1 group/addr cursor-help relative">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Dispatch To</p>
                                                <p className="text-xs font-black text-[#A38A6F] uppercase tracking-widest border-b border-[#A38A6F]/20">{order.address.fullName}</p>
                                                
                                                {/* Address Tooltip */}
                                                <div className="absolute top-full left-0 mt-4 w-64 bg-[#1C1C1C] text-white p-6 rounded-3xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/addr:opacity-100 group-hover/addr:translate-y-0 transition-all z-50">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-3 h-3 text-[#A38A6F]" />
                                                            <p className="text-[9px] font-black uppercase tracking-widest">Destination</p>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-gray-300 leading-relaxed uppercase tracking-wider">
                                                            {order.address.area},<br />
                                                            {order.address.city}, {order.address.state}<br />
                                                            {order.address.phoneNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Artisan ID</p>
                                                <p className="text-[10px] font-black text-gray-900 tracking-tighter uppercase">#{order.id.slice(0, 12)}</p>
                                            </div>
                                            <button className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-[#1C1C1C] hover:text-white transition-all shadow-sm">
                                                <FileText className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Order Content */}
                                    <div className="p-10 space-y-10">
                                        <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-50 rounded-xl">
                                                    {getStatusIcon(order.status)}
                                                </div>
                                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">{order.status}</span>
                                            </div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Est. Completion: Blueprint Validation Stage</p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-8 group/item">
                                                    <div className="w-32 h-44 flex-shrink-0 bg-[#F8F8F8] rounded-[32px] overflow-hidden relative border border-gray-100 shadow-sm group-hover/item:scale-[1.02] transition-transform duration-700">
                                                        <Image src={item.image || assets.upload_area} alt={item.name} fill className="object-cover mix-blend-multiply" />
                                                    </div>
                                                    <div className="flex-1 space-y-6">
                                                        <div className="space-y-1">
                                                            <p className="text-[8px] font-black text-[#A38A6F] uppercase tracking-[0.4em]">Masterpiece</p>
                                                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight leading-tight">{item.name}</h3>
                                                        </div>
                                                        
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.size && (
                                                                <div className="px-3 py-1.5 bg-[#FAFAFA] border border-gray-50 rounded-xl flex items-center gap-2">
                                                                    <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Size</span>
                                                                    <span className="text-[8px] font-black text-gray-900 uppercase tracking-widest">{item.size.replace(',', ' x ')} in</span>
                                                                </div>
                                                            )}
                                                            {item.color && (
                                                                <div className="px-3 py-1.5 bg-[#FAFAFA] border border-gray-50 rounded-xl flex items-center gap-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color.toLowerCase() }} />
                                                                    <span className="text-[8px] font-black text-gray-900 uppercase tracking-widest">{item.color}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {item.bespoke && (
                                                            <div className="bg-[#FAFAFA] p-4 rounded-2xl space-y-3 border border-gray-50">
                                                                <div className="flex items-center gap-2 text-[#A38A6F]">
                                                                    <Scissors className="w-3 h-3" />
                                                                    <p className="text-[8px] font-black uppercase tracking-[0.2em]">Artisan Measurements</p>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                                    {Object.entries(item.bespoke.customMeasurements || {}).map(([label, val]) => (
                                                                        <div key={label} className="flex justify-between items-center border-b border-gray-100 pb-1 last:border-0">
                                                                            <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                                                                            <span className="text-[9px] font-black text-gray-900">{val} in</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {userReviews[`${order.id}_${item.productId}`] && (
                                                            <div className="bg-[#A38A6F]/5 p-4 rounded-2xl border border-[#A38A6F]/10 space-y-2 animate-in fade-in duration-700">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2 text-[#A38A6F]">
                                                                        <Star className="w-3 h-3 fill-current" />
                                                                        <p className="text-[8px] font-black uppercase tracking-[0.2em]">Your Narrative</p>
                                                                    </div>
                                                                    <div className="flex gap-0.5">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Star 
                                                                                key={i} 
                                                                                className={`w-2 h-2 ${i < userReviews[`${order.id}_${item.productId}`].rating ? "fill-[#A38A6F] text-[#A38A6F]" : "text-gray-200"}`} 
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <p className="text-[10px] text-gray-600 italic leading-relaxed">
                                                                    "{userReviews[`${order.id}_${item.productId}`].reviewText}"
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center justify-between pt-2">
                                                            <p className="text-xl font-black text-gray-900 tracking-tighter">{currencySymbol}{item.price.toFixed(2)}</p>
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => router.push(`/product/${item.productId}`)}
                                                                    className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                                                >
                                                                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                                                                </button>
                                                                {order.status === 'Delivered' && !userReviews[`${order.id}_${item.productId}`] && (
                                                                    <button 
                                                                        onClick={() => handleReviewClick(item, order.id)}
                                                                        className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-[#A38A6F] hover:text-white transition-all shadow-sm"
                                                                    >
                                                                        <Star className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hover Decorative Element */}
                                    <div className="absolute bottom-0 right-0 p-10 opacity-0 group-hover:opacity-10 translate-y-10 group-hover:translate-y-0 transition-all duration-1000 pointer-events-none">
                                        <Package className="w-32 h-32 text-[#A38A6F]" />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </main>

            <Footer />

            <AnimatePresence>
                {reviewModalOpen && selectedProduct && (
                    <ReviewModal
                        isOpen={reviewModalOpen}
                        onClose={() => {
                            setReviewModalOpen(false);
                            setSelectedProduct(null);
                            setSelectedOrderId(null);
                        }}
                        product={selectedProduct}
                        orderId={selectedOrderId}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyOrders;