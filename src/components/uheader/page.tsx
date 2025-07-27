"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, X, ChefHat, User, ShoppingCart, Package, Star, Settings } from 'lucide-react';
import { ChevronDown, Shield } from "lucide-react";
import { useAuthStore } from "@/services/store/authStore";
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { storageService } from "@/utils/storage";
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const authStore = useAuthStore();

  // Admin email from your withAuth.tsx
  const ADMIN_EMAIL = 'admin.halwai@gmail.com';

  // Check if user is admin based on email
  const isAdminUser = (email: string): boolean => {
    return email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  };

  // Function to extract first name from display name
  const getFirstName = (displayName: string): string => {
    if (!displayName) return '';
    return displayName.split(' ')[0];
  };

  // Function to get user initials for avatar fallback
  const getUserInitials = (name: string): string => {
    if (!name) return 'U';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    setIsClient(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setAuthToken(user.uid);
        setUserEmail(user.email);
        setUserDisplayName(user.displayName);
        setUserPhotoURL(user.photoURL);
        setIsAdmin(user.email ? isAdminUser(user.email) : false);

        // Set username (prioritize display name, fallback to email)
        if (user.displayName) {
          setUsername(getFirstName(user.displayName));
          // Store the display name in storage for persistence
          storageService.setUsername(user.displayName);
        } else if (user.email) {
          const emailUsername = user.email.split('@')[0];
          setUsername(emailUsername);
          storageService.setUsername(emailUsername);
        }

        // Store auth token
        storageService.setAuthToken(user.uid);
      } else {
        // User is signed out
        setAuthToken(null);
        setUsername(null);
        setUserDisplayName(null);
        setUserEmail(null);
        setUserPhotoURL(null);
        setIsAdmin(false);
        storageService.clearAuthData();
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Navigation items
  const navigationItems = [
    {
      href: "/user/specialThali",
      label: "Special Thali",
      icon: Star
    },
    {
      href: authToken ? '/user' : '/login',
      label: "Customize Thali",
      icon: ChefHat
    },
    {
      href: "#contact",
      label: "Contact Us",
      icon: User
    }
  ];

  // User dropdown items
  const userDropdownItems = [
    ...(isAdmin ? [{
      href: "/admin",
      label: "Admin Portal",
      icon: Shield,
      isAdmin: true
    }] : []),
    {
      href: "/user/cart",
      label: "Your Cart",
      icon: ShoppingCart
    },
    {
      href: "/user/orderSummary",
      label: "Your Orders",
      icon: Package
    },
    {
      href: "/user/specialThali",
      label: "Special Thalis",
      icon: Star
    }
  ];

  // Check if the current route is either /login, /signup, /user, or /admin
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/user" || pathname === "/admin" || pathname === '/user/thali' || pathname === '/user/address' || pathname === '/user/history' || pathname === '/user/cart' || pathname === '/admin/modalManagement' || pathname === '/admin/predefinedThaalis' || pathname === '/admin/menuItems' || pathname === '/admin/users';

  // Show mobile menu on login/signup pages or when not authenticated
  const showMobileMenuButton = !authToken || pathname === "/login" || pathname === "/signup";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      storageService.clearAuthData();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Animation variants
  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const dropdownVariants = {
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-black/95 backdrop-blur-md shadow-xl border-b border-gray-800'
        : 'bg-black text-white'
        }`}
      initial="initial"
      animate="animate"
      variants={headerVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">

          {/* Enhanced Logo Section */}
          <Link href="/">
            <motion.div
              className="flex items-center space-x-2 group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold font-poorStory tracking-wide bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent group-hover:from-amber-200 group-hover:to-orange-200 transition-all duration-300">
                Halwaai
              </div>
            </motion.div>
          </Link>

          {/* Enhanced Navigation Links - Centered */}
          {!isAuthPage && (
            <NavigationMenu className="hidden lg:flex flex-1 justify-center">
              <NavigationMenuList className="flex space-x-8">
                {navigationItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={item.href}>
                        <NavigationMenuLink className="group flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 relative overflow-hidden">
                          <item.icon className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors duration-300" />
                          <span className="text-white group-hover:text-amber-100 transition-colors duration-300 font-poppins">
                            {item.label}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                        </NavigationMenuLink>
                      </Link>
                    </motion.div>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Enhanced Hamburger Menu for Mobile */}
          {showMobileMenuButton && (
            <motion.button
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}

          {/* Enhanced Mobile Navigation Menu */}
          <AnimatePresence>
            {showMobileMenuButton && isMenuOpen && (
              <motion.div
                className="lg:hidden absolute top-full right-4 mt-2 bg-black/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl w-80 overflow-hidden"
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {!isAuthPage && (
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Navigation</h3>
                    <div className="space-y-2">
                      {navigationItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className="group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-amber-400/20 transition-colors duration-300">
                              <item.icon className="w-4 h-4 text-amber-400" />
                            </div>
                            <span className="text-white group-hover:text-amber-100 transition-colors duration-300 font-poppins">
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Authentication Section for Mobile */}
                {!authToken && (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Account</h3>
                    <div className="space-y-3">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <motion.button
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-600 text-black font-bold px-4 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Login
                        </motion.button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                        <motion.button
                          className="w-full border-2 border-gray-600 hover:border-amber-400 text-white hover:text-amber-100 px-4 py-3 rounded-xl transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Sign Up
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Desktop Authentication Section */}
          {!authToken ? (
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/login">
                <motion.button
                  className="border-2 border-gray-600 hover:border-amber-400 text-white hover:text-amber-100 px-6 py-2 rounded-xl transition-all duration-300 font-poppins"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Login
                </motion.button>
              </Link>
              <Link href="/signup">
                <motion.button
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-600 text-black font-bold px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="relative flex items-center space-x-4">
              <motion.button
                className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Enhanced User Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 overflow-hidden ${isAdmin
                  ? 'bg-gradient-to-r from-red-500 to-red-600 group-hover:from-red-600 group-hover:to-red-700'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-gray-700 group-hover:to-gray-800'
                  }`}>
                  {userPhotoURL ? (
                    <img
                      src={userPhotoURL}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : isAdmin ? (
                    <Shield className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {userDisplayName ? getUserInitials(userDisplayName) : 'U'}
                    </span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm text-white group-hover:text-amber-100 transition-colors duration-300 font-poppins">
                    {username || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 group-hover:text-amber-200 transition-colors duration-300">
                    {isAdmin ? 'Administrator' : 'Customer'}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-amber-400 transition-colors duration-300" />
                </motion.div>
              </motion.button>

              {/* Enhanced User Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl w-64 overflow-hidden"
                    variants={dropdownVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${isAdmin ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-gray-600 to-gray-700'
                          }`}>
                          {userPhotoURL ? (
                            <img
                              src={userPhotoURL}
                              alt="Profile"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : isAdmin ? (
                            <Shield className="w-6 h-6 text-white" />
                          ) : (
                            <span className="text-white font-semibold">
                              {userDisplayName ? getUserInitials(userDisplayName) : 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {userDisplayName || username || 'User'}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[150px]">
                            {userEmail}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isAdmin ? 'Administrator' : 'Customer'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {userDropdownItems.map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link href={item.href}>
                              <div className={`group flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 ${item.isAdmin ? 'hover:bg-red-500/20' : ''
                                }`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${item.isAdmin
                                  ? 'bg-red-500/20 group-hover:bg-red-500/30'
                                  : 'bg-gray-800 group-hover:bg-gray-700'
                                  }`}>
                                  <item.icon className={`w-4 h-4 ${item.isAdmin ? 'text-red-400' : 'text-amber-400'
                                    }`} />
                                </div>
                                <span className="text-white group-hover:text-amber-100 transition-colors duration-300 font-poppins">
                                  {item.label}
                                </span>
                              </div>
                            </Link>
                          </motion.div>
                        ))}

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: userDropdownItems.length * 0.05 }}
                          className="pt-2 border-t border-gray-700"
                        >
                          <button
                            onClick={handleLogout}
                            className="group flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-red-500/20 transition-all duration-300 w-full text-left"
                          >
                            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-300">
                              <Settings className="w-4 h-4 text-red-400" />
                            </div>
                            <span className="text-white group-hover:text-red-100 transition-colors duration-300 font-poppins">
                              Logout
                            </span>
                          </button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}