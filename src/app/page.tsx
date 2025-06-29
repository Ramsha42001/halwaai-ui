'use client'
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import Hero from "@/components/hero";
import Header from '@/components/uheader/page'
import PredefinedThali from "@/components/upredefined/page";
import CustomizeThali from "@/components/usteps/page";
import Delivery from "@/components/udelivery/page";
import NgoPage from "@/components/ngo/page";
import Contact from "@/components/contactus/page";
import Footer from "@/components/footer/page";
import BottomNav from "@/components/bottomNav/page";
import { FaWhatsapp } from 'react-icons/fa';
import { X, Star, Sparkles, Heart, Gift } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { ModalConfig } from "@/app/types/modal";
import { useRouter, useSearchParams } from 'next/navigation';
import { menuItemService } from '@/services/api/menuItemService';
import modalService from "@/services/api/modalService";

// Enhanced Login Modal Component
const LoginModal = ({ modal, isOpen, onClose }: {
  modal: ModalConfig,
  isOpen: boolean,
  onClose: () => void
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 50);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[10000] transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
      }`}>
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-red/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
          }`}>

          {/* Decorative Elements */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-[red] to-[black] rounded-full animate-pulse" />
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-[red] to-[black] rounded-full animate-bounce" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>

          {/* Header Section with Gradient */}
          <div className="relative bg-gradient-to-br from-[red] to-[black] p-8 rounded-t-3xl text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4">
                <Star className="w-6 h-6 animate-pulse" />
              </div>
              <div className="absolute top-8 right-8">
                <Sparkles className="w-5 h-5 animate-bounce" />
              </div>
              <div className="absolute bottom-4 left-8">
                <Heart className="w-4 h-4 animate-pulse" />
              </div>
              <div className="absolute bottom-6 right-4">
                <Gift className="w-5 h-5 animate-bounce" />
              </div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2 text-center">
                {modal.title}
              </h2>
              <div className="w-16 h-1 bg-white/50 rounded-full mx-auto" />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <p className="text-gray-700 text-center mb-6 leading-relaxed">
              {modal.description}
            </p>

            {/* Modal Details */}
            <div className="space-y-3 mb-6">
              {/* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-medium">Auto Display:</span>
                <span className="text-indigo-600 font-semibold">
                  {modal.showOnLoad ? "✓ Enabled" : "✗ Disabled"}
                </span>
              </div> */}
              {/* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-medium">Delay:</span>
                <span className="text-purple-600 font-semibold">{modal.delay}ms</span>
              </div> */}
            </div>

            {/* Action Button */}
            <button
              onClick={handleClose}
              className="w-full bg-[black]  text-white font-semibold py-4 px-6 rounded-2xl hover:bg-[gray]  transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {modal.ButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalData, setLoginModalData] = useState<ModalConfig | null>(null);
  const [hasProcessedToken, setHasProcessedToken] = useState(false);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await menuItemService.getMenuItems();
        setMenuItems(data);
        console.log('Menu items loaded:', data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  // Handle token and modal logic
  useEffect(() => {
    const token = searchParams.get('token');
    const existingToken = localStorage.getItem('authToken');

    if (token && !hasProcessedToken) {
      localStorage.setItem('token', token);
      console.log('Token saved:', token);
      setHasProcessedToken(true);

      // Fetch and show login modal
      fetchLoginModal();

      // Clean URL by removing token parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url.toString());

    } else if (existingToken && !hasProcessedToken) {
      // User already has token, still check for login modal
      setHasProcessedToken(true);
      fetchLoginModal();
    }
  }, [searchParams, hasProcessedToken]);

  // Fetch login modal data
  const fetchLoginModal = async () => {
    try {
      console.log('Fetching login modal...');

      // Fix: Change getModals() to getModal()
      const modals = await modalService.getModal();
      console.log('All modals:', modals);

      // Find modal with showOnLoad: true
      const loginModal = modals.find((modal: ModalConfig) => modal.showOnLoad === true);

      if (loginModal) {
        console.log('Login modal found:', loginModal);
        setLoginModalData(loginModal);

        // Show modal after specified delay
        setTimeout(() => {
          setShowLoginModal(true);
        }, loginModal.delay || 2000);
      } else {
        console.log('No login modal found with showOnLoad: true');
      }
    } catch (error) {
      console.error('Error fetching login modal:', error);

      // Fallback: Create a default welcome modal if service fails
      const fallbackModal: ModalConfig = {
        _id: "fallback-modal",
        title: "Welcome Back! 🎉",
        description: "We're excited to have you back! Explore our amazing features and discover what's new.",
        showOnLoad: true,
        delay: 2000,
        ButtonText: "Get Started"
      };

      setLoginModalData(fallbackModal);
      setTimeout(() => {
        setShowLoginModal(true);
      }, fallbackModal.delay);
    }
  };

  // Handle modal close
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    console.log('Login modal closed');
  };

  // WebSocket connection
  useEffect(() => {
    let socket: WebSocket;

    try {
      socket = new WebSocket('ws://localhost:3000');

      socket.onopen = () => {
        console.log('Connected to WebSocket server');
        socket.send('Hello Server!');
      };

      socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
      };

      socket.onclose = () => {
        console.log('Disconnected from WebSocket server');
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }

    // Cleanup on unmount
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <>
      <Header />
      <BottomNav />
      <Hero />
      <PredefinedThali />
      <CustomizeThali />
      <Delivery />
      <NgoPage />
      <Contact />
      <Footer />

      {/* Login Modal */}
      {loginModalData && (
        <LoginModal
          modal={loginModalData}
          isOpen={showLoginModal}
          onClose={handleCloseLoginModal}
        />
      )}

      {/* WhatsApp Icon */}
      <a
        href="https://wa.me/yourwhatsappnumber"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-20 lg:bottom-5 right-5 bg-green-500 p-3 rounded-full text-white z-[9999] hover:bg-green-600 transition-all"
      >
        <FaWhatsapp className="h-6 w-6" />
      </a>

    </>
  );
}