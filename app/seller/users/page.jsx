'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Users = () => {
    const { currency } = useAppContext();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [userOrders, setUserOrders] = useState({});

    const fetchUsers = async () => {
        try {
            // Fetch all users from Firestore
            const usersQuery = query(collection(db, "users"), orderBy("lastLoginAt", "desc"));
            const usersSnapshot = await getDocs(usersQuery);
            const usersDataRaw = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Fetch address subcollection for each user (get ALL addresses)
            const usersWithAddresses = await Promise.all(
                usersDataRaw.map(async (user) => {
                    try {
                        // Fetch ALL addresses from subcollection
                        const addressQuery = query(collection(db, "users", user.id, "address"));
                        const addressSnapshot = await getDocs(addressQuery);

                        // Get all addresses as an array
                        const addresses = addressSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));

                        return {
                            ...user,
                            addresses: addresses // Store all addresses
                        };
                    } catch (error) {
                        console.error(`Error fetching addresses for user ${user.id}:`, error);
                        return {
                            ...user,
                            addresses: []
                        };
                    }
                })
            );

            // Fetch all orders to count per user
            const ordersQuery = query(collection(db, "orders"));
            const ordersSnapshot = await getDocs(ordersQuery);
            const ordersData = ordersSnapshot.docs.map(doc => doc.data());

            // Count orders per user and calculate total spent
            const orderCounts = {};
            ordersData.forEach(order => {
                const userId = order.userId;
                if (!orderCounts[userId]) {
                    orderCounts[userId] = {
                        count: 0,
                        totalSpent: 0,
                        lastOrderDate: null
                    };
                }
                orderCounts[userId].count++;
                orderCounts[userId].totalSpent += parseFloat(order.amount || 0);

                const orderDate = new Date(order.date);
                if (!orderCounts[userId].lastOrderDate || orderDate > orderCounts[userId].lastOrderDate) {
                    orderCounts[userId].lastOrderDate = orderDate;
                }
            });

            setUserOrders(orderCounts);
            setUsers(usersWithAddresses);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();

        // Search in user data
        const matchesUser =
            (user.name?.toLowerCase().includes(searchLower)) ||
            (user.email?.toLowerCase().includes(searchLower));

        // Search in addresses
        const matchesAddress = user.addresses?.some(addr =>
            (addr.fullName?.toLowerCase().includes(searchLower)) ||
            (addr.phoneNumber?.includes(searchTerm))
        );

        return matchesUser || matchesAddress;
    });

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-gray-50 flex flex-col justify-between">
            {loading ? <Loading /> : (
                <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Total Users: <span className="font-semibold text-gray-900">{users.length}</span>
                            </p>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, email or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full md:w-80 text-sm"
                            />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {currency}{Object.values(userOrders).reduce((sum, user) => sum + user.totalSpent, 0).toFixed(2)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {Object.values(userOrders).reduce((sum, user) => sum + user.count, 0)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">User</th>
                                        <th className="px-6 py-4 font-medium">Contact & Address</th>
                                        <th className="px-6 py-4 font-medium">Orders</th>
                                        <th className="px-6 py-4 font-medium">Total Spent</th>
                                        <th className="px-6 py-4 font-medium">Last Order</th>
                                        <th className="px-6 py-4 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((user) => {
                                        const orderData = userOrders[user.id] || { count: 0, totalSpent: 0, lastOrderDate: null };

                                        return (
                                            <tr
                                                key={user.id}
                                                className="bg-white hover:bg-gray-50 transition duration-150 ease-in-out"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{user.name || 'N/A'}</p>
                                                            <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {user.addresses && user.addresses.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {user.addresses.map((address, idx) => (
                                                                <div key={idx} className="border-l-2 border-orange-400 pl-3">
                                                                    <p className="font-medium text-gray-900">{address.fullName || 'N/A'}</p>
                                                                    <p className="text-sm text-gray-600">{address.phoneNumber || 'No phone'}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {address.city && address.state
                                                                            ? `${address.city}, ${address.state}`
                                                                            : address.area || 'No address'}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">No addresses</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderData.count > 0
                                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                        }`}>
                                                        {orderData.count} {orderData.count === 1 ? 'order' : 'orders'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {orderData.totalSpent > 0
                                                        ? `${currency}${orderData.totalSpent.toFixed(2)}`
                                                        : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {formatDate(orderData.lastOrderDate)}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {formatDate(user.lastLoginAt?.toDate ? user.lastLoginAt.toDate() : user.lastLoginAt)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {filteredUsers.length === 0 && (
                            <div className="p-10 text-center text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p className="text-lg font-medium mb-1">No users found</p>
                                <p className="text-sm">Try adjusting your search to find users</p>
                            </div>
                        )}
                    </div>

                    {/* Results Summary */}
                    {filteredUsers.length > 0 && (
                        <div className="mt-4 text-sm text-gray-600 text-center">
                            Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> of{' '}
                            <span className="font-semibold text-gray-900">{users.length}</span> users
                        </div>
                    )}
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Users;
