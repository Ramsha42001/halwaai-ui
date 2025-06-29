"use client";

import { useState } from "react";
import Link from "next/link"; // Import the Link component for routing
import { usePathname } from 'next/navigation'; // Import usePathname to get the current route
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, X } from 'lucide-react';
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "@/services/store/authStore";
import { getAuth, signOut } from 'firebase/auth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility
  const pathname = usePathname(); // Get current route
  const auth = useAuthStore();

  // Check if the current route is either /login, /signup, /user, or /admin
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/user" || pathname === "/admin" || pathname === '/user/thali' || pathname === '/user/address' || pathname === '/user/history' || pathname === '/user/cart' || pathname === '/admin/modalManagement' || pathname === '/admin/predefinedThaalis' || pathname === '/admin/menuItems' || pathname === '/admin/users';

  // Conditionally render the user icon dropdown on /user or /admin routes
  const showUserDropdown = pathname === "/user" || pathname === "/admin" || pathname === '/user/thali' || pathname === '/user/address' || pathname === '/user/history' || pathname === '/user/cart' || pathname === '/admin/modalManagement' || pathname === '/admin/predefinedThaalis' || pathname === '/admin/menuItems' || pathname === '/admin/users';

  const handleLogout = async () => {
    localStorage.removeItem('authToken');
    await signOut(getAuth());
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
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
        {/* {!isAuthPage && (
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
                  href={localStorage.getItem('authToken') ? '/user' : '/login'}
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
        )} */}

        {/* Hamburger Menu for Mobile */}
        {/* {!showUserDropdown && (
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
        )} */}

        {/* Mobile Navigation Menu */}
        <NavigationMenu className={`lg:hidden ${isMenuOpen ? 'flex' : 'hidden'} flex-col absolute top-16 right-[10px] w-full bg-black z-[50]`}>
          {!isAuthPage && (
            <NavigationMenuList className="flex flex-col space-y-4 p-4">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#predefined"
                  className="hover:text-gray-300 transition-colors block py-2"
                >
                  Special Thali
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href={localStorage.getItem('authToken') ? '/user' : '/login'}
                  className="hover:text-gray-300 transition-colors block py-2"
                >
                  Customize Thali
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="hover:text-gray-300 transition-colors block py-2"
                >
                  Contact Us
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          )}

          {/* Authentication Section */}
          {!localStorage.getItem('authToken') ? (
            <>
              {/* Mobile Login/Signup buttons */}
              <div className="space-y-4 mt-4 p-2">
                <Link href="/login">
                  <button className="my-[5px] w-full border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="w-full border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors">
                    SignUp
                  </button>
                </Link>
              </div>
            </>
          ) : null}
        </NavigationMenu>

        {/* Desktop Authentication Section */}
        {!localStorage.getItem('authToken') ? (
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
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <span>{localStorage.getItem('username')}</span>
              <ChevronDown />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-[100%] right-0 mt-2 bg-black text-white rounded-md shadow-lg w-48">
                <ul>
                  <li>
                    <Link href="/user/cart">
                      <p className="block px-4 py-2 hover:bg-gray-700">Your Cart</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/user/history">
                      <p className="block px-4 py-2 hover:bg-gray-700">Order History</p>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700"
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
