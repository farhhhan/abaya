'use client';
import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { collection, addDoc, setDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Loader2, CheckCircle2 } from 'lucide-react';

const OrderPlaced = () => {
    const { router, userData, updateCartQuantity } = useAppContext();
    const [isFinalizing, setIsFinalizing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const hasFinalized = useRef(false);

    useEffect(() => {
        const finalizeOrder = async () => {
            if (hasFinalized.current) return;
            
            const params = new URLSearchParams(window.location.search);
            const paymentIntent = params.get('payment_intent');
            const status = params.get('redirect_status');

            if (paymentIntent && status === 'succeeded') {
                setIsFinalizing(true);
                hasFinalized.current = true;
                
                try {
                    const pendingOrder = localStorage.getItem('pendingArtisanOrder');
                    if (pendingOrder) {
                        const orderData = JSON.parse(pendingOrder);
                        
                        // Finalize the order in Firestore
                        const finalOrderData = {
                            ...orderData,
                            paymentMethod: "Stripe",
                            paymentId: paymentIntent,
                            createdAt: serverTimestamp(),
                            status: "Blueprint Validation"
                        };

                        // Finalize the order in Firestore using sessionId to prevent duplicates
                        const orderRef = doc(db, "orders", orderData.sessionId);
                        await setDoc(orderRef, finalOrderData);

                        // Record coupon usage if applicable
                        if (orderData.couponId) {
                            const couponRef = doc(db, "coupons", orderData.couponId);
                            await updateDoc(couponRef, {
                                usedBy: arrayUnion(orderData.userId)
                            });
                        }

                        // Clear cart items from database/context
                        if (orderData.cartKeys && orderData.cartKeys.length > 0) {
                            for (const key of orderData.cartKeys) {
                                await updateCartQuantity(key, 0);
                            }
                        }

                        localStorage.removeItem('cartMetadata');
                        localStorage.removeItem('pendingArtisanOrder');
                        
                        // Since we can't easily iterate all cart items here without the context's full list,
                        // we rely on the fact that the user is now on the success page.
                        // Ideally, the cart context should provide a clearCart method.
                        // For now, we'll just clear the local storage and the user's view will update.
                        
                        setIsSuccess(true);
                        localStorage.setItem('artisan_order_success', Date.now().toString());
                        toast.success("Artisan Collection Secured Successfully");
                    } else {
                        // Order might have already been saved by the modal's onSuccess callback
                        setIsSuccess(true);
                        localStorage.setItem('artisan_order_success', Date.now().toString());
                    }
                } catch (error) {
                    console.error("Error finalizing Stripe order:", error);
                    toast.error("Handled recovery for your order.");
                } finally {
                    setIsFinalizing(false);
                }
            } else {
                // If no payment intent, assume it was a COD or instant success handled by modal
                setIsSuccess(true);
            }
        };

        finalizeOrder();

        const timer = setTimeout(() => {
            router.push('/my-orders');
        }, 5000);

        return () => clearTimeout(timer);
    }, [userData]);

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col justify-center items-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative flex justify-center">
                    <div className="absolute inset-0 bg-[#A38A6F]/10 rounded-full blur-3xl animate-pulse" />
                    <div className="relative w-32 h-32 bg-white rounded-[40px] shadow-2xl flex items-center justify-center border border-gray-50">
                        {isFinalizing ? (
                            <Loader2 className="w-12 h-12 text-[#A38A6F] animate-spin" />
                        ) : (
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-[10px] font-black text-[#A38A6F] uppercase tracking-[0.5em]">Artisan Transaction Complete</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        {isFinalizing ? "Securing Piece..." : "Collection Secured"}
                    </h1>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed uppercase tracking-widest pt-2">
                        {isFinalizing 
                            ? "We are synchronizing your boutique selection with our logistics vault." 
                            : "Your artisan selection has been successfully reserved in our blueprint validation queue."}
                    </p>
                </div>

                <div className="pt-10 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Redirecting to Private Gallery in 5s</span>
                    </div>
                    
                    <button 
                        onClick={() => router.push('/my-orders')}
                        className="text-black font-black text-[10px] uppercase tracking-[0.3em] hover:underline"
                    >
                        Go to My Orders Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderPlaced;