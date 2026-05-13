import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, addDoc, setDoc, serverTimestamp, getDocs, where, updateDoc, arrayUnion, doc } from "firebase/firestore";
import Image from "next/image";
import { toast } from "react-hot-toast";
import PaymentMethodModal from "./PaymentMethodModal";
import {
  ShieldCheck,
  Sparkles,
  ChevronDown,
  MapPin,
  CreditCard,
  TicketPercent,
  Crown
} from "lucide-react";

const OrderSummary = () => {
  const { currency, currencySymbol, router, getCartCount, getCartAmount, cartItems, products, updateCartQuantity, userData, signInWithGoogle, resolvePrice } = useAppContext()

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [cartMetadata, setCartMetadata] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    localStorage.removeItem('artisan_order_success');
    const handleStorageChange = (e) => {
      if (e.key === 'artisan_order_success') {
        router.push('/order-placed');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const metadata = localStorage.getItem('cartMetadata');
    if (metadata) {
      try {
        setCartMetadata(JSON.parse(metadata));
      } catch (e) {
        console.error("Error parsing cart metadata:", e);
      }
    }
  }, [cartItems]);

  useEffect(() => {
    if (!userData || !userData.id) {
      setUserAddresses([]);
      setSelectedAddressId(null);
      return;
    }

    const addressRef = collection(db, "users", userData.id, "address");
    const q = query(addressRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserAddresses(list);
        setSelectedAddressId((prev) => {
          if (!list.length) return null;
          return list.find((addr) => addr.id === prev) ? prev : list[0].id;
        });
      },
      (error) => {
        console.error("Error fetching addresses:", error);
      }
    );

    return () => unsubscribe();
  }, [userData?.id]);

  const selectedAddress = useMemo(() => {
    return userAddresses.find((addr) => addr.id === selectedAddressId) || null;
  }, [selectedAddressId, userAddresses]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setIsDropdownOpen(false);
  };

  const handleApplyCoupon = async () => {
    if (!userData) {
      toast.error("Please sign in to apply entitlements.");
      return;
    }
    if (!couponCode.trim()) return;

    setIsApplying(true);
    try {
      const q = query(collection(db, "coupons"), where("code", "==", couponCode.trim().toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Invalid entitlement code.");
        setAppliedCoupon(null);
      } else {
        const coupon = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };

        // Validation
        const now = new Date();
        if (coupon.expireDate && coupon.expireDate.toDate() < now) {
          toast.error("This entitlement has expired.");
          return;
        }
        if (getCartAmount() < coupon.minAmount) {
          toast.error(`Minimum purchase of ₹${coupon.minAmount} required.`);
          return;
        }
        if (coupon.usedBy && coupon.usedBy.includes(userData.id)) {
          toast.error("You have already utilized this entitlement.");
          return;
        }

        setAppliedCoupon(coupon);
        toast.success("Entitlement Applied Successfully");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error("Failed to validate entitlement.");
    } finally {
      setIsApplying(false);
    }
  };

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === "percentage") {
      return (getCartAmount() * appliedCoupon.discountValue) / 100;
    } else {
      return appliedCoupon.discountValue;
    }
  }, [appliedCoupon, getCartAmount]);

  const subtotalWithDiscount = getCartAmount() - discountAmount;
  const taxAmount = subtotalWithDiscount * 0.05;
  const finalTotal = subtotalWithDiscount + taxAmount;

  const prepareOrderData = () => {
    const orderItems = [];
    for (const key in cartItems) {
      if (cartItems[key] <= 0) continue;

      const [productId] = key.split('-');
      const product = products.find(p => p._id === productId);
      const metadata = cartMetadata[key] || {};

      if (product) {
        const variantImage = product.variants?.find(v => v.color?.toLowerCase() === metadata.color?.toLowerCase())?.image;
        orderItems.push({
          productId: productId,
          name: product.name,
          price: product.offerPrice,
          quantity: cartItems[key],
          image: variantImage || product.image?.[0] || "",
          color: metadata.color || null,
          bespoke: metadata.bespoke || null,
          size: key.split('-')[1] || null
        });
      }
    }

    return {
      sessionId: `artisan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userData.id,
      items: orderItems,
      amount: finalTotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code || null,
      couponId: appliedCoupon?.id || null,
      address: selectedAddress,
      status: "Blueprint Validation",
      cartKeys: Object.keys(cartItems).filter(key => cartItems[key] > 0),
      createdAt: serverTimestamp(),
      date: new Date().toLocaleDateString()
    };
  };

  const handleCheckoutClick = async () => {
    if (!userData) {
      toast.error("Authentication required to secure piece.");
      await signInWithGoogle();
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }
    if (getCartCount() === 0) {
      toast.error("Your boutique collection is empty.");
      return;
    }

    // Pre-save order data for recovery after redirect
    const orderData = prepareOrderData();
    localStorage.setItem('pendingArtisanOrder', JSON.stringify(orderData));

    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (method, paymentIntentId = null) => {
    setIsPaymentModalOpen(false);
    setIsProcessing(true);

    try {
      const orderData = JSON.parse(localStorage.getItem('pendingArtisanOrder')) || prepareOrderData();

      const finalOrderData = {
        ...orderData,
        paymentMethod: method === "cod" ? "Cash on Delivery" : "Stripe",
        paymentId: paymentIntentId,
        createdAt: serverTimestamp(), // Re-set to ensure server time
      };

      // 1. Save Order using sessionId as document ID to prevent duplicates
      const orderRef = doc(db, "orders", finalOrderData.sessionId);
      await setDoc(orderRef, finalOrderData);

      // 2. Record coupon usage
      if (finalOrderData.couponId) {
        const couponRef = doc(db, "coupons", finalOrderData.couponId);
        await updateDoc(couponRef, {
          usedBy: arrayUnion(userData.id)
        });
      }

      // 3. Clear Cart
      for (const key in cartItems) {
        await updateCartQuantity(key, 0);
      }
      localStorage.removeItem('cartMetadata');
      localStorage.removeItem('pendingArtisanOrder');

      toast.success("Artisan Collection Secured");
      router.push("/order-placed");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to secure artisan piece.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#1C1C1C] text-white rounded-[40px] p-10 shadow-2xl space-y-10 border border-white/5 relative overflow-hidden group">
      {/* Decorative Gold Pulse */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#A38A6F]/20 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />

      <div className="space-y-2 relative z-10">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Boutique Checkout</h2>
        <p className="text-[9px] font-bold text-[#A38A6F] uppercase tracking-[0.3em]">Authorized Artisan Transaction</p>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Address Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#A38A6F]" />
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Dispatch Destination</label>
          </div>

          <div className="relative">
            <button
              className="w-full text-left px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:ring-2 focus:ring-[#A38A6F]/20 outline-none transition-all flex items-center justify-between group hover:bg-white/10"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="block truncate pr-4 text-xs font-bold uppercase tracking-widest">
                {selectedAddress
                  ? `${selectedAddress.fullName} — ${selectedAddress.area}`
                  : userAddresses.length
                    ? "Select Collection Point"
                    : "No Destination Stored"}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-500 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute w-full bg-[#2A2A2A] border border-white/10 shadow-2xl rounded-2xl mt-4 z-50 py-3 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-500">
                {userAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`px-6 py-4 hover:bg-white/5 cursor-pointer transition-colors ${address.id === selectedAddressId ? "bg-[#A38A6F]/10 text-[#A38A6F]" : "text-gray-300"}`}
                    onClick={() => handleAddressSelect(address.id)}
                  >
                    <p className="font-black text-[10px] uppercase tracking-widest">{address.fullName}</p>
                    <p className="text-[9px] font-medium text-gray-500 mt-1 truncate uppercase tracking-widest">
                      {address.area}, {address.city}
                    </p>
                  </div>
                ))}
                <div
                  onClick={() => { setIsDropdownOpen(false); router.push("/add-address"); }}
                  className="px-6 py-4 hover:bg-white/5 cursor-pointer text-center text-[#A38A6F] font-black text-[9px] border-t border-white/5 uppercase tracking-[0.2em]"
                >
                  Establish New Destination
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Promo Entitlement */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TicketPercent className="w-3.5 h-3.5 text-[#A38A6F]" />
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Entitlement Code</label>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder={appliedCoupon ? appliedCoupon.code : "ARTISAN-CODE"}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={!!appliedCoupon || isApplying}
              className="flex-grow outline-none px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black placeholder:text-gray-600 focus:bg-white/10 focus:border-[#A38A6F]/50 transition-all uppercase tracking-widest disabled:opacity-50"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={!!appliedCoupon || isApplying || !couponCode.trim()}
              className="bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#A38A6F] hover:text-white transition-all disabled:opacity-50"
            >
              {isApplying ? "..." : appliedCoupon ? "Applied" : "Apply"}
            </button>
          </div>
          {appliedCoupon && (
            <div className="flex items-center justify-between px-4 py-2 bg-[#A38A6F]/10 border border-[#A38A6F]/20 rounded-xl">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#A38A6F]">Code {appliedCoupon.code} Verified</p>
              <button onClick={() => { setAppliedCoupon(null); setCouponCode(""); }} className="text-[9px] font-bold text-gray-500 uppercase hover:text-white">Remove</button>
            </div>
          )}
        </div>

        {/* Financial Breakdown */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
            <p>Collection Value ({getCartCount()} Pieces)</p>
            <p className="text-white">{currencySymbol}{getCartAmount().toFixed(2)}</p>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#A38A6F]">
              <p>Entitlement Discount ({appliedCoupon.discountType === "percentage" ? `${appliedCoupon.discountValue}%` : "Fixed"})</p>
              <p>- {currencySymbol}{discountAmount.toFixed(2)}</p>
            </div>
          )}

          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
            <p>Global Priority Shipping</p>
            <p className="text-[#A38A6F]">Complimentary</p>
          </div>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
            <p>Boutique Service Tax (5%)</p>
            <p className="text-white">{currencySymbol}{taxAmount.toFixed(2)}</p>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-6">
            <div className="space-y-1">
              <p className="text-3xl font-black tracking-tighter">{currencySymbol}{finalTotal.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <Crown className="w-3 h-3 text-[#A38A6F]" />
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest italic">Artisan Priority Verified</p>
              </div>
            </div>
            <p className="text-[8px] font-black text-[#A38A6F] uppercase tracking-[0.3em]">Total Collection Fee</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleCheckoutClick}
        disabled={isProcessing}
        className="w-full bg-[#A38A6F] text-white py-6 rounded-[24px] font-black text-[11px] uppercase tracking-[0.4em] mt-8 hover:bg-[#8e765e] transition-all shadow-2xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Validating Artisan Order...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Secure Artisan Piece
          </>
        )}
      </button>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
        <Image src="/visa.png" alt="Visa" width={40} height={25} className="object-contain" />
        <Image src="/mastercard.png" alt="Mastercard" width={40} height={25} className="object-contain" />
        <Image src="/paypal.png" alt="PayPal" width={50} height={25} className="object-contain" />
      </div>

      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={finalTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default OrderSummary;