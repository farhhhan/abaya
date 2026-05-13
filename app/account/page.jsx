'use client';
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { collection, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, Phone, Mail, User, Trash2, Edit2, Plus, Home, ChevronRight, X } from "lucide-react";
import { toast } from "react-hot-toast";

const AccountPage = () => {
    const { userData, isSignedIn, logout } = useAppContext();
    const router = useRouter();

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchAddresses = async () => {
        if (!userData) return;
        try {
            const q = collection(db, "users", userData.id, "address");
            const querySnapshot = await getDocs(q);
            const addressList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAddresses(addressList);
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isSignedIn && userData) {
            fetchAddresses();
        } else if (!isSignedIn) {
            setLoading(false);
        }
    }, [userData, isSignedIn]);

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            await deleteDoc(doc(db, "users", userData.id, "address", addressId));
            toast.success("Address removed successfully");
            fetchAddresses();
        } catch (error) {
            console.error("Error deleting address:", error);
            toast.error("Failed to delete address");
        }
    };

    const handleEditClick = (address) => {
        setCurrentAddress(address);
        setEditModalOpen(true);
    };

    const handleUpdateAddress = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const addressRef = doc(db, "users", userData.id, "address", currentAddress.id);
            await updateDoc(addressRef, {
                ...currentAddress,
                updatedAt: serverTimestamp()
            });
            toast.success("Address updated successfully");
            setEditModalOpen(false);
            fetchAddresses();
        } catch (error) {
            console.error("Error updating address:", error);
            toast.error("Failed to update address");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isSignedIn && !loading) {
        return (
            <div className="min-h-screen bg-[#FDFDFD]">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-32 px-6">
                    <User className="w-16 h-16 text-gray-200 mb-6" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-4">Authentication Required</h2>
                    <p className="text-gray-500 text-sm mb-10 max-w-xs text-center">Please sign in to access your private artisan account.</p>
                    <button onClick={() => router.push('/')} className="bg-black text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#1C1C1C] transition-all">Return to Home</button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Navbar />
            
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-32 py-16">
                
                {/* Profile Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 flex flex-col md:flex-row items-center gap-10 border-b border-gray-100 pb-16"
                >
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-[#A38A6F] to-[#8e765e] p-1 shadow-2xl shadow-[#A38A6F]/20 group-hover:scale-105 transition-transform duration-700">
                            <div className="w-full h-full rounded-[38px] bg-white overflow-hidden flex items-center justify-center">
                                {userData?.photoURL ? (
                                    <Image src={userData.photoURL} alt={userData.name} width={128} height={128} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-black text-[#A38A6F]">{(userData?.name || 'U').charAt(0)}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <p className="text-[10px] font-black text-[#A38A6F] uppercase tracking-[0.4em]">Premium Artisan Client</p>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">{userData?.name}</h1>
                        <p className="text-gray-400 font-medium text-sm tracking-widest">{userData?.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                            <button onClick={() => router.push('/my-orders')} className="bg-[#FAFAFA] text-black px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest border border-gray-100 hover:bg-white hover:border-[#A38A6F]/20 transition-all flex items-center gap-2">
                                View Collection History
                                <ChevronRight className="w-3 h-3" />
                            </button>
                            <button onClick={logout} className="text-red-500 font-black text-[9px] uppercase tracking-widest hover:underline px-4 py-3 transition-all">Sign Out</button>
                        </div>
                    </div>
                </motion.div>

                {/* Account Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                    
                    {/* Sidebar / Navigation */}
                    <div className="lg:col-span-1 space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Account Control</h3>
                            <div className="space-y-2">
                                <button className="w-full text-left px-8 py-5 bg-[#1C1C1C] text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest flex items-center justify-between group shadow-2xl">
                                    Manage Addresses
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#A38A6F] animate-pulse" />
                                </button>
                                <button onClick={() => router.push('/my-orders')} className="w-full text-left px-8 py-5 hover:bg-[#FAFAFA] text-gray-400 hover:text-black rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all">
                                    Collection History
                                </button>
                                <button onClick={() => router.push('/cart')} className="w-full text-left px-8 py-5 hover:bg-[#FAFAFA] text-gray-400 hover:text-black rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all">
                                    Private Gallery
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area - Address Management */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="flex justify-between items-end">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Stored Destinations</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em]">Dispatch Coordinates for Logistics</p>
                            </div>
                            <button 
                                onClick={() => router.push('/add-address')}
                                className="bg-black text-white px-8 py-4 rounded-3xl font-black text-[9px] uppercase tracking-widest hover:bg-[#A38A6F] transition-all flex items-center gap-2 shadow-xl"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Destination
                            </button>
                        </div>

                        {loading ? <Loading /> : (
                            <div className="grid grid-cols-1 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {addresses.length === 0 ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="py-20 bg-[#FAFAFA] rounded-[48px] border border-gray-100 border-dashed text-center space-y-6"
                                        >
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                                                <MapPin className="w-6 h-6 text-gray-200" />
                                            </div>
                                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">No Destinations Stored</p>
                                        </motion.div>
                                    ) : (
                                        addresses.map((addr) => (
                                            <motion.div
                                                key={addr.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="bg-white rounded-[32px] p-8 border border-gray-100 flex flex-col md:flex-row justify-between gap-8 hover:border-[#A38A6F]/20 hover:shadow-2xl transition-all duration-500 group"
                                            >
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-[#FAFAFA] flex items-center justify-center group-hover:bg-[#A38A6F]/10 transition-colors">
                                                            <Home className="w-3.5 h-3.5 text-[#A38A6F]" />
                                                        </div>
                                                        <h4 className="font-black text-sm uppercase tracking-widest text-gray-900">{addr.fullName}</h4>
                                                    </div>
                                                    <div className="space-y-1.5 pl-11">
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{addr.area}</p>
                                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{addr.city}, {addr.state} — {addr.pincode}</p>
                                                        <div className="flex flex-wrap gap-6 pt-2">
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="w-3 h-3 text-[#A38A6F]" />
                                                                <span className="text-[10px] font-black text-gray-400 tracking-widest">{addr.phoneNumber}</span>
                                                            </div>
                                                            {addr.email && (
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="w-3 h-3 text-[#A38A6F]" />
                                                                    <span className="text-[10px] font-black text-gray-400 tracking-widest">{addr.email}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 md:flex-col md:justify-center md:border-l md:border-gray-50 md:pl-8">
                                                    <button 
                                                        onClick={() => handleEditClick(addr)}
                                                        className="flex-1 md:flex-none p-4 bg-[#FAFAFA] text-black hover:bg-black hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2 group/btn"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteAddress(addr.id)}
                                                        className="flex-1 md:flex-none p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Delete</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Address Modal */}
            {editModalOpen && currentAddress && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="bg-[#1C1C1C] p-10 text-white flex justify-between items-center relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-[#A38A6F]/20 rounded-full blur-3xl -mr-16 -mt-16" />
                             <div className="relative z-10">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">Edit Destination</h3>
                                <p className="text-[#A38A6F] text-[9px] font-black uppercase tracking-[0.3em] mt-1">Refine Artisan Dispatch Coordinates</p>
                             </div>
                             <button onClick={() => setEditModalOpen(false)} className="relative z-10 p-3 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                             </button>
                        </div>
                        
                        <form onSubmit={handleUpdateAddress} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] transition-all uppercase tracking-widest"
                                        value={currentAddress.fullName}
                                        onChange={(e) => setCurrentAddress({...currentAddress, fullName: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] transition-all tracking-widest"
                                        value={currentAddress.email}
                                        onChange={(e) => setCurrentAddress({...currentAddress, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Primary Phone</label>
                                    <input 
                                        type="tel" 
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] transition-all tracking-widest"
                                        value={currentAddress.phoneNumber}
                                        onChange={(e) => setCurrentAddress({...currentAddress, phoneNumber: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Alternative Phone</label>
                                    <input 
                                        type="tel" 
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] transition-all tracking-widest"
                                        value={currentAddress.altPhoneNumber}
                                        onChange={(e) => setCurrentAddress({...currentAddress, altPhoneNumber: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pin Code</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] transition-all tracking-widest"
                                        value={currentAddress.pincode}
                                        onChange={(e) => setCurrentAddress({...currentAddress, pincode: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">City</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] transition-all uppercase tracking-widest"
                                            value={currentAddress.city}
                                            onChange={(e) => setCurrentAddress({...currentAddress, city: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">State</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-[#A38A6F] transition-all uppercase tracking-widest"
                                            value={currentAddress.state}
                                            onChange={(e) => setCurrentAddress({...currentAddress, state: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-span-full space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Precise Address</label>
                                    <textarea 
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-xs font-bold outline-none focus:border-[#A38A6F] transition-all uppercase tracking-widest resize-none"
                                        rows={4}
                                        value={currentAddress.area}
                                        onChange={(e) => setCurrentAddress({...currentAddress, area: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="flex-1 py-5 border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    Discard Changes
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#A38A6F] transition-all shadow-xl disabled:opacity-50"
                                >
                                    {isSaving ? "Stashing Updates..." : "Update Destination"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default AccountPage;
