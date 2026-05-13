'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import { useAppContext } from '@/context/AppContext';

const AllReviewsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { products, currency } = useAppContext();

    const [reviews, setReviews] = useState([]);
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(10);
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });
    const [filterRating, setFilterRating] = useState('all');

    useEffect(() => {
        fetchProductData();
        fetchReviews();
    }, [id]);

    const fetchProductData = () => {
        const product = products.find(p => p._id === id);
        setProductData(product);
    };

    const fetchReviews = async () => {
        if (!id) return;

        try {
            const reviewsRef = collection(db, 'reviews');

            // Fetch all reviews for this product
            const allReviewsQuery = query(
                reviewsRef,
                where('productId', '==', id),
                orderBy('rating', 'desc'),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(allReviewsQuery);
            const allReviewsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Calculate statistics
            const totalReviews = allReviewsData.length;
            const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            let totalRating = 0;

            allReviewsData.forEach(review => {
                distribution[review.rating]++;
                totalRating += review.rating;
            });

            const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

            setStats({
                averageRating,
                totalReviews,
                ratingDistribution: distribution
            });

            setReviews(allReviewsData);
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

    const renderStars = (rating, size = 'md') => {
        const sizeClass = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
        const dimension = size === 'lg' ? 24 : size === 'md' ? 20 : 16;
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Image
                        key={star}
                        src={star <= rating ? assets.star_icon : assets.star_dull_icon}
                        alt="star"
                        width={dimension}
                        height={dimension}
                        className={sizeClass}
                    />
                ))}
            </div>
        );
    };

    const getProgressColor = (rating) => {
        if (rating >= 4) return 'bg-green-500';
        if (rating >= 3) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const filteredReviews = filterRating === 'all'
        ? reviews
        : reviews.filter(review => review.rating === parseInt(filterRating));

    const displayedReviews = filteredReviews.slice(0, displayCount);
    const hasMore = displayedReviews.length < filteredReviews.length;

    if (loading || !productData) {
        return <Loading />;
    }

    const mainImage = (Array.isArray(productData?.image) && productData.image[0]) ||
        (Array.isArray(productData?.images) && productData.images[0]) ||
        (Array.isArray(productData?.imageUrls) && productData.imageUrls[0]) ||
        assets.upload_area;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Product Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <div className="flex items-center gap-6">
                            {/* Back Button */}
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="font-medium">Back</span>
                            </button>

                            {/* Product Info */}
                            <div className="flex items-center gap-6 flex-1">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                    <Image
                                        src={mainImage}
                                        alt={productData.name}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover mix-blend-multiply"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-xl font-bold text-gray-900 mb-1">{productData.name}</h1>
                                    <div className="flex items-center gap-4">
                                        <p className="text-2xl font-bold text-orange-600">
                                            {currency}{productData.offerPrice}
                                        </p>
                                        <p className="text-lg text-gray-500 line-through">
                                            {currency}{productData.price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Content */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Page Title */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
                        <p className="text-gray-600">Read what customers are saying about this product</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Sidebar - Rating Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32 border border-gray-100">
                                {/* Overall Rating */}
                                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                                    <div className="text-5xl font-bold text-gray-900 mb-2">
                                        {stats.averageRating}
                                    </div>
                                    <div className="flex justify-center mb-2">
                                        {renderStars(Math.round(stats.averageRating), 'lg')}
                                    </div>
                                    <p className="text-gray-600 font-medium">
                                        {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                                    </p>
                                </div>

                                {/* Rating Distribution */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-gray-900 mb-4">Rating Breakdown</h3>
                                    <div className="space-y-3">
                                        {[5, 4, 3, 2, 1].map((rating) => {
                                            const count = stats.ratingDistribution[rating];
                                            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                                            return (
                                                <button
                                                    key={rating}
                                                    onClick={() => setFilterRating(filterRating === rating.toString() ? 'all' : rating.toString())}
                                                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${filterRating === rating.toString() ? 'bg-orange-50 border border-orange-200' : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-1 w-16">
                                                        <span className="text-sm font-semibold text-gray-700">{rating}</span>
                                                        <Image src={assets.star_icon} alt="star" width={16} height={16} className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                                        <div
                                                            className={`h-full ${getProgressColor(rating)} transition-all duration-500`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600 w-12 text-right">
                                                        {count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Filter Reset */}
                                {filterRating !== 'all' && (
                                    <button
                                        onClick={() => setFilterRating('all')}
                                        className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                                    >
                                        Show All Reviews
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Content - Reviews List */}
                        <div className="lg:col-span-2">
                            {/* Filter Info */}
                            <div className="mb-6 flex items-center justify-between">
                                <p className="text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{displayedReviews.length}</span> of{' '}
                                    <span className="font-semibold text-gray-900">{filteredReviews.length}</span> reviews
                                    {filterRating !== 'all' && ` with ${filterRating} stars`}
                                </p>
                            </div>

                            {/* Reviews Grid */}
                            {displayedReviews.length > 0 ? (
                                <div className="space-y-4">
                                    {displayedReviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-orange-200"
                                        >
                                            <div className="flex items-start gap-5">
                                                {/* User Avatar */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                        {review.userName?.charAt(0).toUpperCase() || 'A'}
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    {/* User Info & Rating */}
                                                    <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h4 className="font-bold text-gray-900 text-lg">
                                                                    {review.userName}
                                                                </h4>
                                                                {review.verified && (
                                                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Verified Purchase
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                {renderStars(review.rating, 'md')}
                                                                <span className="text-sm text-gray-500 font-medium">
                                                                    {formatDate(review.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Review Text */}
                                                    <p className="text-gray-700 leading-relaxed text-base">
                                                        {review.reviewText}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div className="text-center pt-6">
                                            <button
                                                onClick={() => setDisplayCount(prev => prev + 10)}
                                                className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                Load More Reviews
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <p className="text-sm text-gray-500 mt-3">
                                                Showing {displayedReviews.length} of {filteredReviews.length} reviews
                                            </p>
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
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Found</h3>
                                    <p className="text-gray-600">
                                        {filterRating !== 'all'
                                            ? `No reviews with ${filterRating} stars yet.`
                                            : 'Be the first to leave a review for this product!'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllReviewsPage;
