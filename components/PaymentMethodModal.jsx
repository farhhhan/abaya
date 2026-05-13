"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Banknote, ShieldCheck, ChevronRight, ArrowLeft, Loader2, IndianRupee, Coins, Wallet } from "lucide-react";

// Note: loadStripe is now handled inside the component to support dynamic keys from Admin Settings.

const CheckoutForm = ({ amount, onSuccess, onCancel, currencySymbol }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + "/order-placed",
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
            toast.error(error.message);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            onSuccess(paymentIntent.id);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-8">
            <div className="bg-[#FAFAFA] rounded-3xl p-8 border border-gray-100 shadow-inner">
                <PaymentElement />
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                    {message}
                </motion.div>
            )}

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-8 py-5 border-2 border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-gray-50 hover:text-black transition-all"
                >
                    Discard
                </button>
                <button
                    disabled={isLoading || !stripe || !elements}
                    className="flex-[2] bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] py-5 px-8 rounded-2xl hover:bg-[#1C1C1C] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-black/20"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-3">
                            <Loader2 className="w-4 h-4 animate-spin text-[#A38A6F]" />
                            Securing...
                        </span>
                    ) : (
                        `Authorize ${currencySymbol}${amount.toFixed(2)}`
                    )}
                </button>
            </div>
        </form>
    );
};

const PaymentMethodModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess }) => {
    const { currencySymbol, stripePublishableKey } = useAppContext();
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [stripePromise, setStripePromise] = useState(null);

    useEffect(() => {
        if (stripePublishableKey) {
            setStripePromise(loadStripe(stripePublishableKey));
        }
    }, [stripePublishableKey]);

    useEffect(() => {
        if (isOpen && paymentMethod === "stripe" && !clientSecret) {
            fetch("/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Math.round(totalAmount * 100) }),
            })
                .then((res) => res.json())
                .then((data) => setClientSecret(data.clientSecret));
        }
    }, [isOpen, paymentMethod, totalAmount, clientSecret]);

    const handleCodSelect = () => {
        onPaymentSuccess("cod");
    };

    const handleStripeSuccess = (paymentIntentId) => {
        onPaymentSuccess("stripe", paymentIntentId);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-white rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-xl overflow-hidden relative z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header: Boutique Style */}
                    <div className="bg-[#1C1C1C] px-10 py-12 text-white relative overflow-hidden border-b border-white/5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A38A6F]/20 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse" />
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-[#A38A6F] uppercase tracking-[0.5em]">Secure Gateway</p>
                                <h2 className="text-4xl font-black tracking-tighter uppercase">Payment <span className="text-[#A38A6F]">Method</span></h2>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Select your preferred artisan transaction route</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-10">
                        <AnimatePresence mode="wait">
                            {!paymentMethod ? (
                                <motion.div
                                    key="selection"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    {/* Valuation Display */}
                                    <div className="bg-[#FAFAFA] rounded-[32px] p-8 border border-gray-100 flex items-center justify-between mb-8 group hover:border-[#A38A6F]/20 transition-all duration-500">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Final Valuation</p>
                                            <p className="text-4xl font-black text-gray-900 tracking-tighter">{currencySymbol}{totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 transition-transform duration-500 relative">
                                            <ShieldCheck className="w-6 h-6 text-[#A38A6F]" />
                                            <div className="absolute -top-1 -right-1">
                                                <div className="flex -space-x-1">
                                                    <div className="w-3 h-3 rounded-full bg-[#A38A6F] border-2 border-white" />
                                                    <div className="w-3 h-3 rounded-full bg-black border-2 border-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Options Grid */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <button
                                            onClick={() => setPaymentMethod("cod")}
                                            className="group relative w-full text-left p-8 bg-white border-2 border-gray-100 rounded-[32px] hover:border-[#A38A6F] hover:shadow-2xl hover:shadow-[#A38A6F]/5 transition-all duration-500"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-[#FAFAFA] rounded-2xl flex items-center justify-center group-hover:bg-[#A38A6F] transition-colors duration-500 relative overflow-hidden">
                                                    <Banknote className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors duration-500 relative z-10" />
                                                    <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                                        <Coins className="w-12 h-12 text-black" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-900">Cash on Delivery</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pay upon hand-delivery</p>
                                                        <IndianRupee className="w-3 h-3 text-gray-300 group-hover:text-[#A38A6F]" />
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#A38A6F] group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setPaymentMethod("stripe")}
                                            className="group relative w-full text-left p-8 bg-white border-2 border-gray-100 rounded-[32px] hover:border-[#A38A6F] hover:shadow-2xl hover:shadow-[#A38A6F]/5 transition-all duration-500"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-[#FAFAFA] rounded-2xl flex items-center justify-center group-hover:bg-[#A38A6F] transition-colors duration-500 relative overflow-hidden">
                                                    <CreditCard className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors duration-500 relative z-10" />
                                                    <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                                        <Wallet className="w-12 h-12 text-black" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-900">Pay Online Now</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cards • UPI • Wallets</p>
                                                        <div className="flex gap-1">
                                                            <div className="px-1.5 py-0.5 bg-gray-50 rounded text-[7px] font-black text-gray-400 border border-gray-100 group-hover:border-[#A38A6F]/30 group-hover:text-[#A38A6F]">UPI</div>
                                                            <div className="px-1.5 py-0.5 bg-gray-50 rounded text-[7px] font-black text-gray-400 border border-gray-100 group-hover:border-[#A38A6F]/30 group-hover:text-[#A38A6F]">VISA</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#A38A6F] group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>
                                    </div>
                                </motion.div>
                            ) : paymentMethod === "cod" ? (
                                <motion.div
                                    key="cod"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-center space-y-10 py-6"
                                >
                                    <div className="space-y-6">
                                        <div className="w-24 h-24 bg-[#FAFAFA] rounded-[32px] flex items-center justify-center mx-auto border border-gray-100 shadow-sm relative">
                                            <Banknote className="w-10 h-10 text-[#A38A6F]" />
                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                                                <ShieldCheck className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black tracking-tighter uppercase">Confirm Delivery Pay</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed px-10">
                                                Finalize your order for <span className="text-black">{currencySymbol}{totalAmount.toFixed(2)}</span>. Amount to be paid in cash upon physical verification of your selection.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setPaymentMethod(null)}
                                            className="flex-1 px-8 py-5 border-2 border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-gray-50 hover:text-black transition-all flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft className="w-3.5 h-3.5" />
                                            Back
                                        </button>
                                        <button
                                            onClick={handleCodSelect}
                                            className="flex-[2] bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] py-5 px-8 rounded-2xl hover:bg-[#1C1C1C] transition-all shadow-2xl"
                                        >
                                            Secure Collection
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="stripe"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                                        <div>
                                            <h3 className="font-black text-xs uppercase tracking-widest text-gray-900">Artisan Card Gateway</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">100% Encrypted Transaction</p>
                                        </div>
                                        <button
                                            onClick={() => setPaymentMethod(null)}
                                            className="text-[10px] font-black uppercase tracking-widest text-[#A38A6F] hover:underline flex items-center gap-2"
                                        >
                                            <ArrowLeft className="w-3 h-3" />
                                            Routes
                                        </button>
                                    </div>

                                    {clientSecret && stripePromise ? (
                                        <Elements options={{ clientSecret, appearance: { theme: 'stripe' } }} stripe={stripePromise}>
                                            <CheckoutForm
                                                amount={totalAmount}
                                                onSuccess={handleStripeSuccess}
                                                onCancel={onClose}
                                                currencySymbol={currencySymbol}
                                            />
                                        </Elements>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 space-y-6">
                                            <div className="relative">
                                                <Loader2 className="w-12 h-12 text-[#A38A6F] animate-spin" />
                                                <div className="absolute inset-0 rounded-full bg-[#A38A6F]/10 animate-pulse" />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Initializing Secure Vault...</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentMethodModal;
