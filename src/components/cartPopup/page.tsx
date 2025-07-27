'use client'
import React, { useState, useEffect } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/services/store/menuItemsStore';

export const CartPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const cartItems = useStore(state => state.cart.items) || [];

    // Calculate total items in cart

    const totalItems = cartItems.reduce((sum, item) => sum + (item.cartQuantity || 1), 0);
    console.log(cartItems)

    useEffect(() => {
        if (totalItems > 0) {
            setIsVisible(true);
            setIsAnimating(true);
        } else {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [totalItems]);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out ${isAnimating ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
                }`}
        >
            <Link href="/user/cart">
                <div className="relative group cursor-pointer">
                    {/* Main popup container */}
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:shadow-3xl transform transition-all duration-200 hover:scale-105 hover:-translate-y-1">
                        {/* Animated cart icon */}
                        <div className="relative">
                            <ShoppingCart className="w-6 h-6 animate-bounce" />
                            {/* Item count badge */}
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                {totalItems}
                            </div>
                        </div>

                        {/* Text content */}
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">Your Cart</span>
                            <span className="text-xs opacity-80">
                                {totalItems} {totalItems === 1 ? 'item' : 'items'} added
                            </span>
                        </div>

                        {/* Arrow indicator */}
                        <div className="ml-2 transform group-hover:translate-x-1 transition-transform">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>

                    {/* Ripple effect on hover */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                </div>
            </Link>
        </div>
    );
};