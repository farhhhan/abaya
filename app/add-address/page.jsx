'use client'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, User, Navigation, Home, ChevronLeft } from "lucide-react";

const initialAddressState = {
    fullName: '',
    email: '',
    phoneNumber: '',
    altPhoneNumber: '',
    pincode: '',
    area: '',
    city: '',
    state: '',
};

const AddAddress = () => {
    const [address, setAddress] = useState(initialAddressState)
    const [isSaving, setIsSaving] = useState(false);
    const { isSignedIn, userData } = useAppContext();
    const router = useRouter();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!isSignedIn || !userData) {
            toast.error("Please login to save an address.");
            return;
        }

        const requiredFields = ['fullName', 'email', 'phoneNumber', 'pincode', 'area', 'city', 'state'];
        const hasEmptyField = requiredFields.some((field) => !address[field].trim());
        
        if (hasEmptyField) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsSaving(true);
        try {
            await addDoc(collection(db, "users", userData.id, "address"), {
                ...address,
                createdAt: serverTimestamp(),
            });
            toast.success("Artisan Dispatch Destination Stored");
            setAddress(initialAddressState);
            router.push("/cart");
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error("Failed to store destination.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-32 py-16">
                
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10"
                >
                    <div className="space-y-4">
                        <button 
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#A38A6F] transition-colors"
                        >
                            <ChevronLeft className="w-3 h-3" />
                            Return to Cart
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Establish <span className="text-[#A38A6F]">Destination</span>
                        </h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Artisan Dispatch Registration</p>
                    </div>
                    <div className="flex items-center gap-4 bg-[#FAFAFA] px-6 py-4 rounded-3xl border border-gray-100 shadow-sm">
                        <MapPin className="w-5 h-5 text-[#A38A6F]" />
                        <div className="text-left">
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Global Shipping</p>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest italic">Priority Boutique Logistics</p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1"
                    >
                        <form onSubmit={onSubmitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Personal Information */}
                            <div className="col-span-full space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-3.5 h-3.5 text-[#A38A6F]" />
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Personal Identity</label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <input
                                            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none group-focus-within:border-[#A38A6F] group-focus-within:ring-4 group-focus-within:ring-[#A38A6F]/5 transition-all uppercase tracking-widest"
                                            type="text"
                                            placeholder="Full Name"
                                            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                                            value={address.fullName}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-200 group-focus-within:text-[#A38A6F] transition-colors" />
                                        <input
                                            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none group-focus-within:border-[#A38A6F] group-focus-within:ring-4 group-focus-within:ring-[#A38A6F]/5 transition-all tracking-widest"
                                            type="email"
                                            placeholder="Email Address"
                                            onChange={(e) => setAddress({ ...address, email: e.target.value })}
                                            value={address.email}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Verification */}
                            <div className="col-span-full space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Phone className="w-3.5 h-3.5 text-[#A38A6F]" />
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Contact Verification</label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] focus:ring-4 focus:ring-[#A38A6F]/5 transition-all tracking-widest"
                                        type="tel"
                                        placeholder="Primary Mobile Number"
                                        onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                                        value={address.phoneNumber}
                                    />
                                    <input
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] focus:ring-4 focus:ring-[#A38A6F]/5 transition-all tracking-widest"
                                        type="tel"
                                        placeholder="Alternative Number (Optional)"
                                        onChange={(e) => setAddress({ ...address, altPhoneNumber: e.target.value })}
                                        value={address.altPhoneNumber}
                                    />
                                </div>
                            </div>

                            {/* Dispatch Coordinates */}
                            <div className="col-span-full space-y-6 pt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Navigation className="w-3.5 h-3.5 text-[#A38A6F]" />
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Dispatch Coordinates</label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <input
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] transition-all tracking-widest"
                                        type="text"
                                        placeholder="Pin Code"
                                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                        value={address.pincode}
                                    />
                                    <input
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] transition-all tracking-widest uppercase"
                                        type="text"
                                        placeholder="City / Town"
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        value={address.city}
                                    />
                                    <input
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] transition-all tracking-widest uppercase"
                                        type="text"
                                        placeholder="State"
                                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                        value={address.state}
                                    />
                                </div>
                                <textarea
                                    className="w-full px-6 py-6 bg-white border border-gray-100 rounded-3xl text-xs font-bold outline-none focus:border-[#A38A6F] focus:ring-4 focus:ring-[#A38A6F]/5 transition-all resize-none uppercase tracking-widest"
                                    rows={4}
                                    placeholder="Precise Address (Building, Street, Landmark)"
                                    onChange={(e) => setAddress({ ...address, area: e.target.value })}
                                    value={address.area}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="col-span-full bg-black text-white py-6 rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] mt-8 hover:bg-[#1C1C1C] transition-all shadow-2xl hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? "Stashing Coordinates..." : "Register Dispatch Destination"}
                            </button>
                        </form>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="hidden lg:block w-[400px]"
                    >
                        <div className="bg-[#1C1C1C] text-white p-12 rounded-[64px] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#A38A6F]/10 rounded-full blur-3xl -mr-32 -mt-32" />
                            <div className="relative z-10 space-y-10">
                                <div className="w-16 h-16 bg-[#A38A6F] rounded-2xl flex items-center justify-center shadow-2xl">
                                    <Home className="w-8 h-8 text-white" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Global Boutique<br/>Logistics</h3>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Your artisan selection will be hand-inspected and dispatched to your registered boutique destination within 48 hours of secure payment validation.</p>
                                </div>
                                <div className="pt-10 border-t border-white/5 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#A38A6F]" />
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Secure Tracking Provided</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#A38A6F]" />
                                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-300">Eco-Friendly Artisan Packaging</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AddAddress;