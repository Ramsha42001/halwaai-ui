"use client";

import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo Section */}
        <div className="text-3xl font-medium font-poorStory tracking-wide">
          Halwaai
        </div>

        {/* Hamburger Menu for Mobile */}
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

        {/* Navigation Links */}
        <NavigationMenu className={`lg:flex ${isMenuOpen ? 'flex' : 'hidden'} flex-col lg:flex-row absolute lg:relative top-16 lg:top-0 left-0 lg:left-auto w-full lg:w-auto bg-black lg:bg-transparent z-50`}>
          <NavigationMenuList className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 p-4 lg:p-0">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className="hover:text-gray-300 transition-colors block py-2 lg:py-0"
              >
                Predefined Thali
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
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
                Pricing
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
        </NavigationMenu>

        {/* Buttons Section */}
        <div className="hidden lg:flex space-x-4">
          <button className="border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors">
            Login
          </button>
          <button className="border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition-colors">
            SignUp
          </button>
        </div>
      </div>
    </header>
  );
}

