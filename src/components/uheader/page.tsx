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


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility
  const pathname = usePathname(); // Get current route

  // Check if the current route is either /login, /signup, /user, or /admin
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/user" || pathname === "/admin" || pathname==='/user/thali' || pathname==='/user/address' || pathname==='/user/history' || pathname==='/user/cart' || pathname==='/admin/modalManagement' || pathname==='/admin/predefinedThaalis' || pathname==='/admin/menuItems';

  // Conditionally render the user icon dropdown on /user or /admin routes
  const showUserDropdown = pathname === "/user" || pathname === "/admin" || pathname==='/user/thali' || pathname==='/user/address' || pathname==='/user/history' || pathname==='/user/cart' || pathname==='/admin/modalManagement' || pathname==='/admin/predefinedThaalis' || pathname==='/admin/menuItems';

  return (
    <header className="bg-black text-white fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo Section */}
        <Link href="/">
          <div className="text-3xl font-medium font-poorStory tracking-wide">
            Halwaai
          </div>
        </Link>

        {/* Hamburger Menu for Mobile */}
       {!showUserDropdown && ( <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>)}

        {/* Navigation Links */}
        <NavigationMenu className={`lg:flex ${isMenuOpen ? 'flex' : 'hidden'} flex-col lg:flex-row absolute lg:relative top-16 lg:top-0 right-[10px] lg:left-auto w-full lg:w-auto bg-black lg:bg-transparent z-[50]`}>
          {/* Only show these links if not on the login/signup pages */}
          {!isAuthPage && (
            <NavigationMenuList className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 p-4 lg:p-0">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#predefined"
                  className="hover:text-gray-300 transition-colors block py-2 lg:py-0"
                >
                  Predefined Thali
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/user"
                  className="hover:text-gray-300 transition-colors block py-2 lg:py-0"
                >
                  Customize Thali
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className="hover:text-gray-300 transition-colors block py-2 lg:py-0"
                >
                  Contact Us
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          )}

          {/* Mobile Navigation - Login & Signup */}
        {!showUserDropdown &&(  <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} space-y-4 mt-4`}>
            <Link href="/login">
              <button className="w-full border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="w-full border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors">
                SignUp
              </button>
            </Link>
          </div>
          )}
        </NavigationMenu>

        {/* Buttons Section for larger screens */}
        {!showUserDropdown && (
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
        </div>)}

        {/* User Icon & Dropdown - Only visible on /user or /admin */}
        {showUserDropdown && (
          <div className="relative flex items-center space-x-4">
            {/* User Icon */}
            <button
              className="flex items-center space-x-2 text-white"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-xl">👤</span> {/* User icon */}
              </div>
              <span>Username </span> 
              <ChevronDown /> {/* Username */}
            </button>

            {/* Dropdown Menu */}
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
                    <Link href="/">
                      <p className="block px-4 py-2 hover:bg-gray-700">Logout</p>
                    </Link>
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
