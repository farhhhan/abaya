'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

const OrderDetails = () => {
    const { id } = useParams();
    const { currency } = useAppContext();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    const fetchOrder = async () => {
        try {
            const docRef = doc(db, "orders", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setOrder({ id: docSnap.id, ...data });
                setStatus(data.status);
            } else {
                toast.error("Order not found");
            }
        } catch (error) {
            console.error("Error fetching order:", error);
            toast.error("Failed to fetch order details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const docRef = doc(db, "orders", id);
            await updateDoc(docRef, { status: newStatus });
            setStatus(newStatus);
            toast.success("Order status updated");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    if (loading) return <Loading />;
    if (!order) return <div className="p-10 text-center">Order not found</div>;

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-gray-50 flex flex-col justify-between">
            <div className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                        <p className="text-gray-500 text-sm mt-1">Order ID: #{order.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                            status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                'bg-orange-100 text-orange-800 border-orange-200'
                            }`}>
                            {status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden min-h-[60vh] flex flex-col">
                            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800 text-lg">Order Items</h3>
                                <span className="text-sm text-gray-500 font-medium">{order.items.length} Items</span>
                            </div>
                            <div className="divide-y divide-gray-100 flex-1">
                                {order.items.map((item, index) => (
                                    <div key={index} className="p-8 flex gap-8 items-start hover:bg-gray-50 transition duration-200">
                                        <div className="w-40 h-40 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                            <Image
                                                src={item.image || assets.box_icon}
                                                alt={item.name}
                                                width={160}
                                                height={160}
                                                className="w-full h-full object-cover mix-blend-multiply"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-4">
                                            <h4 className="font-bold text-gray-900 text-2xl leading-tight">{item.name}</h4>
                                            <div className="flex flex-wrap gap-x-8 gap-y-3 text-base text-gray-600">
                                                <p className="flex items-center gap-2"><span className="text-gray-400">Price:</span> <span className="font-medium text-gray-900">{currency}{item.price}</span></p>
                                                <p className="flex items-center gap-2"><span className="text-gray-400">Qty:</span> <span className="font-medium text-gray-900">{item.quantity}</span></p>
                                                {item.size && <p className="flex items-center gap-2"><span className="text-gray-400">Size:</span> <span className="font-medium text-gray-900">{Array.isArray(item.size) ? item.size.join(' x ') : item.size.replace(',', ' x ')} in</span></p>}
                                                {item.thickness && <p className="flex items-center gap-2"><span className="text-gray-400">Thickness:</span> <span className="font-medium text-gray-900">{item.thickness} in</span></p>}
                                                {item.category && <p className="flex items-center gap-2"><span className="text-gray-400">Category:</span> <span className="font-medium text-gray-900">{item.category}</span></p>}
                                            </div>
                                        </div>
                                        <div className="text-right font-bold text-3xl text-gray-900">
                                            {currency}{item.price * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center mt-auto">
                                <span className="font-semibold text-gray-700 text-lg">Total Amount</span>
                                <span className="font-bold text-2xl text-orange-600">{currency}{order.amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Customer & Status */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-700 mb-4">Update Status</h3>
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-3">
                                Changing status will send a notification to the customer.
                            </p>
                        </div>

                        {/* Customer Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-700 mb-4">Customer Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{order.address.fullName}</p>
                                        <p className="text-gray-500">Customer</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{order.address.phoneNumber}</p>
                                        <p className="text-gray-500">Contact</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{order.address.area}</p>
                                        <p className="text-gray-500">{order.address.city}, {order.address.state}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-700 mb-4">Payment Info</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">{order.paymentMethod}</span>
                                </div>
                                {order.paymentId && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <p className="text-gray-500 text-xs mb-1">Transaction ID</p>
                                        <p className="font-mono text-xs text-gray-700 break-all bg-gray-50 p-2 rounded border border-gray-200">
                                            {order.paymentId}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderDetails;
