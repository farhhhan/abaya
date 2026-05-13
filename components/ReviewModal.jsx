'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAppContext } from '@/context/AppContext';
import { X, Star, Sparkles, ShieldCheck } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, product, orderId }) => {
    const { userData } = useAppContext();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (reviewText.trim().length < 10) {
            setError('Review must be at least 10 characters long');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Check if user already reviewed this product
            const reviewsRef = collection(db, 'reviews');
            const q = query(
                reviewsRef,
                where('productId', '==', product.productId || product._id),
                where('userId', '==', userData.id)
            );
            const existingReviews = await getDocs(q);

            if (!existingReviews.empty) {
                setError('You have already reviewed this product');
                setIsSubmitting(false);
                return;
            }

            await addDoc(collection(db, 'reviews'), {
                productId: product.productId || product._id,
                productName: product.name,
                productImage: product.image,
                userId: userData.id,
                userName: userData.name || 'Artisan Collector',
                userEmail: userData.email || '',
                orderId: orderId,
                rating: rating,
                reviewText: reviewText.trim(),
                createdAt: serverTimestamp(),
                verified: true // Since it's from a delivered order
            });

            // Reset form
            setRating(0);
            setReviewText('');
            alert('Review submitted successfully!');
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            setError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[300] p-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative">
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#A38A6F]/5 rounded-full blur-3xl -mr-16 -mt-16" />

                {/* Header */}
                <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center relative z-10">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Artisan Narrative</h2>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Share Your Masterwork Experience</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm group"
                    >
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Product Selection Display */}
                    <div className="px-10 py-8 bg-[#FAFAFA] border-b border-gray-50">
                        <div className="flex gap-8 items-center">
                            <div className="w-24 h-24 bg-white rounded-[24px] overflow-hidden border border-gray-100 p-2 shadow-inner flex-shrink-0">
                                <div className="w-full h-full relative rounded-2xl overflow-hidden">
                                    <Image
                                        src={product.image || assets.upload_area}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[8px] font-black text-[#A38A6F] uppercase tracking-[0.4em]">Acquired Piece</p>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-tight">{product.name}</h3>
                                {product.size && (
                                    <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-100">
                                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Blueprint</span>
                                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{Array.isArray(product.size) ? product.size.join(' x ') : product.size.replace(',', ' x ')} in</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-10">
                        {/* Artisan Valuation (Rating) */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Star className="w-4 h-4 text-[#A38A6F]" />
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Artisan Valuation Score</label>
                            </div>
                            
                            <div className="flex gap-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-all duration-300 hover:scale-125"
                                    >
                                        <Star 
                                            className={`w-10 h-10 ${star <= (hoveredRating || rating) ? "fill-[#A38A6F] text-[#A38A6F]" : "text-gray-100"}`}
                                            strokeWidth={star <= (hoveredRating || rating) ? 0 : 2}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-[10px] font-black text-[#A38A6F] uppercase tracking-[0.4em] animate-in fade-in slide-in-from-left-2">
                                    {rating === 1 && 'Artisan Disappointment'}
                                    {rating === 2 && 'Fair Craftsmanship'}
                                    {rating === 3 && 'Commendable Quality'}
                                    {rating === 4 && 'Superior Artisan Work'}
                                    {rating === 5 && 'Masterpiece Excellence'}
                                </p>
                            )}
                        </div>

                        {/* Artisan Narrative (Text) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-4 h-4 text-[#A38A6F]" />
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Your Masterwork Narrative</label>
                            </div>
                            <div className="relative">
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Compose your thoughts on this artisan piece..."
                                    rows="5"
                                    className="w-full bg-[#FAFAFA] border border-gray-100 rounded-[32px] px-8 py-6 focus:bg-white focus:ring-2 focus:ring-[#A38A6F]/20 focus:border-[#A38A6F] transition-all outline-none text-gray-900 placeholder:text-gray-300 font-medium leading-relaxed"
                                    disabled={isSubmitting}
                                />
                                <div className="absolute bottom-6 right-8 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                    {reviewText.length} / 10 Min
                                </div>
                            </div>
                        </div>

                        {/* Error Management */}
                        {error && (
                            <div className="bg-red-50/50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Validation Badge */}
                        <div className="bg-[#A38A6F]/5 border border-[#A38A6F]/10 px-6 py-4 rounded-2xl flex items-center gap-4 group">
                            <ShieldCheck className="w-5 h-5 text-[#A38A6F] group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-black text-[#A38A6F] uppercase tracking-widest">Verified Artisan Acquisition Protection</span>
                        </div>

                        {/* Submission Control */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-5 px-8 border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                                disabled={isSubmitting}
                            >
                                Retract
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] py-5 px-8 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#A38A6F] transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:bg-gray-200 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Validating...' : 'Publish Narrative'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
