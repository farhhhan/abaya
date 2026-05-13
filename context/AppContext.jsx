'use client'
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, doc, setDoc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-hot-toast";
import { productsDummyData } from "@/assets/assets";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {
    const [currency, setCurrency] = useState('USD');
    const [currencySymbol, setCurrencySymbol] = useState('$');
    const [stripePublishableKey, setStripePublishableKey] = useState(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const [globalSettings, setGlobalSettings] = useState(null);
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [productsLoading, setProductsLoading] = useState(true)
    const [userData, setUserData] = useState(null)
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [isSeller, setIsSeller] = useState(true)
    const [cartItems, setCartItems] = useState({})
    const [wishlist, setWishlist] = useState([])

    const sanitizeImageUrl = (url) => {
        if (typeof url !== 'string') return url;
        if (url.includes('images.unsplash.com')) {
            return "https://res.cloudinary.com/djbvf02yt/image/upload/v1738667237/lrllaprpos2pnp5c9pyy.png";
        }
        return url;
    };

    const normalizeImages = (data) => {
        let rawImages = [];
        if (Array.isArray(data?.image) && data.image.length) rawImages = data.image;
        else if (Array.isArray(data?.images) && data.images.length) rawImages = data.images;
        else if (Array.isArray(data?.imageUrls) && data.imageUrls.length) rawImages = data.imageUrls;

        return rawImages.map(url => sanitizeImageUrl(url));
    };

    const fetchProductData = () => {
        if (!db) {
            console.warn("Database not initialized. Check your Firebase API keys.");
            setProducts([...productsDummyData]);
            setProductsLoading(false);
            return null;
        }
        const productsRef = collection(db, "products_abaya");
        const productsQuery = query(productsRef, orderBy("createdAt", "desc"));

        return onSnapshot(productsQuery, (snapshot) => {
            const productsData = snapshot.docs.map((doc) => {
                const data = doc.data();
                const imageArray = normalizeImages(data);

                return {
                    _id: doc.id,
                    ...data,
                    image: imageArray,
                    imageUrls: imageArray,
                    category: Array.isArray(data.category) ? data.category : (data.category ? [data.category] : [])
                };
            });

            const hasAbayas = productsData.some(p =>
                (Array.isArray(p.category) && p.category.some(cat => cat.toLowerCase().includes('abaya'))) ||
                p.name?.toLowerCase().includes('abaya')
            );

            const finalProducts = (productsData.length > 0 && hasAbayas)
                ? productsData
                : [...productsDummyData, ...productsData];

            setProducts(finalProducts);
            setProductsLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setProductsLoading(false);
        });
    }

    const signInWithGoogle = async () => {
        if (!auth) {
            toast.error("Authentication service not available. Check API keys.");
            return null;
        }
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                // Create user profile
                await setDoc(userDocRef, {
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    role: 'customer',
                    createdAt: new Date().toISOString(),
                    lastLoginAt: new Date().toISOString()
                });
            } else {
                // Update last login
                await setDoc(userDocRef, {
                    lastLoginAt: new Date().toISOString(),
                    photoURL: user.photoURL // Sync photo
                }, { merge: true });
            }
            toast.success("Successfully authenticated");
            return user;
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            toast.error("Authentication failed");
            return null;
        }
    };

    const logout = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            router.push('/');
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error("Failed to logout");
        }
    };

    const addToCart = async (itemId, qty = 1, size = null, thickness = null, category = null, options = {}) => {
        const quantity = Number(qty) || 1;
        if (quantity <= 0) {
            toast.error("Quantity must be at least 1.");
            return;
        }

        let cartKey = itemId;
        const color = options.color || "";
        const sizeStr = Array.isArray(size) ? size.join('x') : (size || "");
        const bespokeStr = options.bespoke ? Object.entries(options.bespoke.customMeasurements || {}).map(([k, v]) => `${k}:${v}`).join('|') : "";

        cartKey = `${itemId}-${sizeStr}-${color}-${bespokeStr}`;

        const cartData = structuredClone(cartItems || {});
        cartData[cartKey] = (cartData[cartKey] || 0) + quantity;

        if (options.bespoke || color || options.image) {
            const metadata = JSON.parse(localStorage.getItem('cartMetadata') || '{}');
            metadata[cartKey] = {
                color,
                bespoke: options.bespoke,
                image: options.image || null
            };
            localStorage.setItem('cartMetadata', JSON.stringify(metadata));
        }

        setCartItems(cartData);
        localStorage.setItem('cartItems', JSON.stringify(cartData));
        toast.success("Added to Boutique Collection");
    }

    const updateCartQuantity = async (itemId, quantity) => {
        const cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)
        localStorage.setItem('cartItems', JSON.stringify(cartData));
    }

    const addToWishlist = async (productId) => {
        if (!wishlist.includes(productId)) {
            const newWishlist = [...wishlist, productId];
            setWishlist(newWishlist);
            if (userData) {
                await setDoc(doc(db, 'wishlist', userData._id), { items: newWishlist });
            } else {
                localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            }
            toast.success("Added to Boutique Wishlist");
        }
    };

    const removeFromWishlist = async (productId) => {
        const newWishlist = wishlist.filter(id => id !== productId);
        setWishlist(newWishlist);
        if (userData) {
            await setDoc(doc(db, 'wishlist', userData._id), { items: newWishlist });
        } else {
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        }
        toast.success("Removed from Wishlist");
    };

    const isInWishlist = (productId) => wishlist.includes(productId);

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const key in cartItems) {
            const productId = key.split('-')[0];
            const itemInfo = products.find((product) => product._id === productId);
            if (!itemInfo || cartItems[key] <= 0) continue;
            const price = resolvePrice(itemInfo);
            totalAmount += price * cartItems[key];
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    const resolvePrice = (product) => {
        if (!product) return 0;
        // Check for dynamic regional pricing
        if (product.prices && product.prices[currency]) {
            return Number(product.prices[currency].offerPrice || product.prices[currency].price || product.offerPrice);
        }
        // Fallback to default offer price
        return Number(product.offerPrice || product.price || 0);
    };

    const fetchGlobalSettings = async () => {
        if (!db) return;
        try {
            const settingsRef = doc(db, "settings", "global");
            const settingsSnap = await getDoc(settingsRef);
            if (settingsSnap.exists()) {
                const settings = settingsSnap.data();
                setGlobalSettings(settings);
                if (settings.stripePublishableKey) {
                    setStripePublishableKey(settings.stripePublishableKey);
                }
                await detectCurrency(settings);
            } else {
                await detectCurrency({ gccCountries: 'AE,SA,QA,KW,BH,OM', indiaCurrency: 'INR', defaultCurrency: 'USD' });
            }
        } catch (error) {
            console.error("Error fetching global settings:", error);
        }
    };

    const detectCurrency = async (settings) => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const countryCode = data.country_code;

            const symbolMap = {
                'INR': '₹', 'USD': '$', 'AED': 'د.إ', 'SAR': 'ر.س',
                'QAR': 'ر.ق', 'KWD': 'د.ك', 'BHD': 'د.ب', 'OMR': 'ر.ع'
            };

            let detectedCurrency = settings.defaultCurrency || 'USD';
            if (countryCode === 'IN') {
                detectedCurrency = settings.indiaCurrency || 'INR';
            } else if (settings.gccCountries?.split(',').includes(countryCode)) {
                const gccMap = { 'AE': 'AED', 'SA': 'SAR', 'QA': 'QAR', 'KW': 'KWD', 'BH': 'BHD', 'OM': 'OMR' };
                detectedCurrency = gccMap[countryCode] || 'AED';
            }

            setCurrency(detectedCurrency);
            setCurrencySymbol(symbolMap[detectedCurrency] || detectedCurrency);
        } catch (error) {
            console.error("Geo-detection failed, using default:", error);
            setCurrency(settings?.defaultCurrency || 'USD');
            setCurrencySymbol('$');
        }
    };

    // Product Data Listener
    useEffect(() => {
        const unsubscribe = fetchProductData()
        fetchGlobalSettings();

        const localCart = localStorage.getItem('cartItems');
        if (localCart) {
            try {
                setCartItems(JSON.parse(localCart));
            } catch (e) {
                console.error("Error parsing local cart:", e);
            }
        }

        const localWishlist = localStorage.getItem('wishlist');
        if (localWishlist) {
            try {
                setWishlist(JSON.parse(localWishlist));
            } catch (e) {
                console.error("Error parsing local wishlist:", e);
            }
        }

        return () => {
            if (typeof unsubscribe === "function") {
                unsubscribe();
            }
        }
    }, [])

    // Auth State Listener
    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch extra user details from firestore if needed, otherwise use auth payload
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    setUserData(data);
                } else {
                    const basicData = {
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        lastLoginAt: new Date().toISOString()
                    };
                    setUserData(basicData);
                }
                setIsSignedIn(true);

                // Fetch Wishlist
                const wishlistRef = doc(db, 'wishlist', user.uid);
                const wishlistSnap = await getDoc(wishlistRef);
                if (wishlistSnap.exists()) {
                    setWishlist(wishlistSnap.data().items || []);
                }
            } else {
                setUserData(null);
                setIsSignedIn(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const value = {
        currency, setCurrency,
        currencySymbol,
        stripePublishableKey,
        globalSettings,
        router,
        isSeller, setIsSeller,
        userData, isSignedIn,
        products, productsLoading,
        cartItems, setCartItems,
        wishlist, setWishlist,
        addToCart, updateCartQuantity,
        addToWishlist, removeFromWishlist, isInWishlist,
        getCartCount, getCartAmount, resolvePrice,
        signInWithGoogle, logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}