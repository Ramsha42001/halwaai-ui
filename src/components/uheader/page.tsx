"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Import the Link component for routing
import { usePathname } from 'next/navigation'; // Import usePathname to get the current route
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, X } from 'lucide-react';
import { ChevronDown, Shield } from "lucide-react";
import { useAuthStore } from "@/services/store/authStore";
import { getAuth, signOut } from 'firebase/auth';
import { storageService } from "@/utils/storage";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility
  const [isClient, setIsClient] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname(); // Get current route
  const auth = useAuthStore();

  // Admin email from your withAuth.tsx
  const ADMIN_EMAIL = 'admin.halwai@gmail.com';

  // Check if user is admin based on email
  const isAdminUser = (email: string): boolean => {
    return email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  };

  // Check if we're on the client side and load auth data
  useEffect(() => {
    setIsClient(true);
    setAuthToken(storageService.getAuthToken());
    setUsername(storageService.getUsername());

    // Check if current user is admin
    const currentUser = getAuth().currentUser;
    if (currentUser?.email) {
      setIsAdmin(isAdminUser(currentUser.email));
    }
  }, []);

  // Check if the current route is either /login, /signup, /user, or /admin
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/user" || pathname === "/admin" || pathname === '/user/thali' || pathname === '/user/address' || pathname === '/user/history' || pathname === '/user/cart' || pathname === '/admin/modalManagement' || pathname === '/admin/predefinedThaalis' || pathname === '/admin/menuItems' || pathname === '/admin/users';

  // Conditionally render the user icon dropdown on /user or /admin routes
  const showUserDropdown = pathname === "/user" || pathname === "/admin" || pathname === '/user/thali' || pathname === '/user/address' || pathname === '/user/history' || pathname === '/user/cart' || pathname === '/admin/modalManagement' || pathname === '/admin/predefinedThaalis' || pathname === '/admin/menuItems' || pathname === '/admin/users';

  // Show mobile menu on login/signup pages or when not authenticated
  const showMobileMenuButton = !authToken || pathname === "/login" || pathname === "/signup";

  const handleLogout = async () => {
    storageService.clearAuthData();
    await signOut(getAuth());
    window.location.href = '/login';
  };

  return (
    <header className="bg-black text-white fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo Section */}
        <Link href="/">
          <div className="text-3xl font-medium font-poorStory tracking-wide">
            Halwaai
          </div>
        </Link>

        {/* Navigation Links - Centered */}
        {!isAuthPage && (
          <NavigationMenu className="hidden lg:flex flex-1 justify-center">
            <NavigationMenuList className="flex space-x-6">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#predefined"
                  className="hover:text-gray-300 transition-colors"
                >
                  Special Thali
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href={authToken ? '/user' : '/login'}
                  className="hover:text-gray-300 transition-colors"
                >
                  Customize Thali
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="hover:text-gray-300 transition-colors"
                >
                  Contact Us
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* Hamburger Menu for Mobile - Show on login/signup pages and when not authenticated */}
        {showMobileMenuButton && (
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}

        {/* Mobile Navigation Menu */}
        {showMobileMenuButton && (
          <NavigationMenu className={`lg:hidden ${isMenuOpen ? 'flex' : 'hidden'} flex-col absolute top-16 right-4 bg-black z-[50] rounded-lg shadow-lg border border-gray-700 w-64`}>
            {!isAuthPage && (
              <NavigationMenuList className="flex flex-col space-y-2 p-4 border-b border-gray-700">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#predefined"
                    className="hover:text-gray-300 transition-colors block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Special Thali
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href={authToken ? '/user' : '/login'}
                    className="hover:text-gray-300 transition-colors block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Customize Thali
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="#"
                    className="hover:text-gray-300 transition-colors block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            )}

            {/* Authentication Section for Mobile */}
            {!authToken && (
              <div className="flex flex-col space-y-3 p-4">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full border border-white px-4 py-3 rounded-md hover:bg-white hover:text-black transition-colors text-center">
                    Login
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full border border-white px-4 py-3 rounded-md hover:bg-white hover:text-black transition-colors text-center">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </NavigationMenu>
        )}

        {/* Desktop Authentication Section */}
        {!authToken ? (
          <div className="hidden lg:flex space-x-4">
            <Link href="/login">
              <button className="border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors">
                SignUp
              </button>
            </Link>
          </div>
        ) : (
          <div className="relative flex items-center space-x-4">
            <button
              className="flex items-center space-x-2 text-white"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAdmin ? 'bg-red-600' : 'bg-gray-600'}`}>
                {isAdmin ? (
                  <Shield className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              <ChevronDown />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-[100%] right-0 mt-2 bg-black text-white rounded-md shadow-lg w-48 border border-gray-700">
                <ul>
                  {/* Show Admin Portal option only for admin users */}
                  {isAdmin && (
                    <li>
                      <Link href="/admin">
                        <p className="block px-4 py-2 hover:bg-gray-700 rounded-t-md flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>Admin Portal</span>
                        </p>
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link href="/user/cart">
                      <p className={`block px-4 py-2 hover:bg-gray-700 ${!isAdmin ? 'rounded-t-md' : ''}`}>Your Cart</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/user/orderSummary">
                      <p className="block px-4 py-2 hover:bg-gray-700">Your Orders</p>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-b-md"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}