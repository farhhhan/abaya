'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const ProductReviews = ({ productId }) => {
    const router = useRouter();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        reviewsWith3Plus: 0
    });

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        if (!productId) return;

        try {
            const reviewsRef = collection(db, 'reviews');

            // Fetch last 5 five-star reviews
            const fiveStarQuery = query(
                reviewsRef,
                where('productId', '==', productId),
                where('rating', '==', 5),
                orderBy('createdAt', 'desc'),
                limit(5)
            );

            const fiveStarSnapshot = await getDocs(fiveStarQuery);
            const fiveStarReviews = fiveStarSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Fetch all reviews for statistics
            const allReviewsQuery = query(
                reviewsRef,
                where('productId', '==', productId)
            );
            const allReviewsSnapshot = await getDocs(allReviewsQuery);
            const allReviewsData = allReviewsSnapshot.docs.map(doc => doc.data());

            // Calculate statistics
            const totalReviews = allReviewsData.length;
            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            let totalRating = 0;
            let reviewsWith3Plus = 0;

            allReviewsData.forEach(review => {
                distribution[review.rating]++;
                totalRating += review.rating;
                if (review.rating >= 3) reviewsWith3Plus++;
            });

            const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

            setStats({
                averageRating,
                totalReviews,
                ratingDistribution: distribution,
                reviewsWith3Plus
            });

            setReviews(fiveStarReviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const renderStars = (rating, size = 'sm') => {
        const sizeClass = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Image
                        key={star}
                        src={star <= rating ? assets.star_icon : assets.star_dull_icon}
                        alt="star"
                        width={size === 'lg' ? 24 : size === 'md' ? 20 : 16}
                        height={size === 'lg' ? 24 : size === 'md' ? 20 : 16}
                        className={sizeClass}
                    />
                ))}
            </div>
        );
    };

    const getProgressColor = (rating) => {
        if (rating >= 4) return 'bg-[#A38A6F]';
        if (rating >= 3) return 'bg-gray-400';
        return 'bg-gray-200';
    };

    if (loading) {
        return (
            <div className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="h-32 bg-gray-200 rounded"></div>
                            <div className="h-32 bg-gray-200 rounded md:col-span-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (stats.totalReviews === 0) {
        return null; // Don't show section if no reviews
    }

    return (
        <div className="py-24 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Customer<br/><span className="text-[#A38A6F]">Voices</span>
                        </h2>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">
                            Community Narratives & Artisan Feedback
                        </p>
                    </div>
                    <div className="hidden md:block w-32 h-1 bg-[#A38A6F]/20 rounded-full"></div>
                </div>

                {/* Rating Overview Card */}
                <div className="bg-[#FAFAFA] rounded-[48px] border border-gray-100 p-12 mb-20 shadow-sm">
                    <div className="grid md:grid-cols-3 gap-16 items-center">
                        {/* Overall Rating */}
                        <div className="text-center md:border-r border-gray-100 pr-0 md:pr-16">
                            <div className="mb-6">
                                <div className="text-8xl font-black text-gray-900 tracking-tighter mb-2">
                                    {stats.averageRating}
                                </div>
                                <div className="flex justify-center mb-4">
                                    {renderStars(Math.round(stats.averageRating), 'lg')}
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'Artisan Review' : 'Artisan Reviews'}
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-[#A38A6F]/10 text-[#A38A6F] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified Artisan Collective
                            </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="md:col-span-2">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Valuation Distribution</h3>
                            <div className="space-y-4">
                                {[5, 4, 3, 2, 1].map((rating) => {
                                    const count = stats.ratingDistribution[rating];
                                    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                                    return (
                                        <div key={rating} className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 w-16">
                                                <span className="text-[10px] font-black text-gray-900 w-3">{rating}</span>
                                                <Image src={assets.star_icon} alt="star" width={12} height={12} className="w-3 h-3" />
                                            </div>
                                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full ${getProgressColor(rating)} transition-all duration-1000 rounded-full`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 w-20 text-right uppercase tracking-widest">
                                                {count} Pieces
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                {reviews.length > 0 ? (
                    <div>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                                    Top Artisan Reviews
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    ({stats.reviewsWith3Plus} Narratives with 3+ Excellence score)
                                </p>
                            </div>

                            <button
                                onClick={() => router.push(`/product/${productId}/reviews`)}
                                className="px-10 py-4 bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-[#A38A6F] transition-all shadow-xl hover:scale-105"
                            >
                                View Global Collective
                            </button>
                        </div>

                        <div className="grid gap-6 mb-8">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-orange-200"
                                >
                                    <div className="flex items-start gap-5">
                                        {/* User Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 bg-[#1C1C1C] border border-[#A38A6F]/20 rounded-[20px] flex items-center justify-center text-white font-black text-xl shadow-lg uppercase tracking-tighter">
                                                {review.userName?.charAt(0).toUpperCase() || 'A'}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {/* User Info & Rating */}
                                            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <h4 className="font-black text-gray-900 text-xl uppercase tracking-tighter">
                                                            {review.userName}
                                                        </h4>
                                                        {review.verified && (
                                                            <span className="inline-flex items-center gap-2 bg-[#A38A6F]/10 text-[#A38A6F] text-[8px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest">
                                                                Verified Artisan Piece
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {renderStars(review.rating, 'md')}
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                            {formatDate(review.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Review Text */}
                                            <p className="text-gray-700 leading-relaxed text-base">
                                                {review.reviewText}
                                            </p>

                                            {/* Helpful Section */}
                                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                                    Artisan Validation Helpful?
                                                </p>
                                                <div className="flex gap-4">
                                                    <button className="text-[10px] font-black text-[#A38A6F] uppercase tracking-widest hover:underline">
                                                        Endorse
                                                    </button>
                                                    <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:underline">
                                                        Dispute
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom View All Button */}
                        {stats.reviewsWith3Plus > 5 && (
                            <div className="text-center">
                                <button
                                    onClick={() => router.push(`/product/${productId}/reviews`)}
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    View All {stats.reviewsWith3Plus} Reviews
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No 5-Star Reviews Yet</h3>
                        <p className="text-gray-600 mb-4">Be the first to leave a 5-star review for this product!</p>
                        {stats.reviewsWith3Plus > 0 && (
                            <button
                                onClick={() => router.push(`/product/${productId}/reviews`)}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition"
                            >
                                View All {stats.reviewsWith3Plus} Reviews
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
