'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Utensils, ChefHat, ClipboardList, User, LogOut } from 'lucide-react'
import { getAuth, signOut } from 'firebase/auth';
import { storageService } from "@/utils/storage";
import { useState, useEffect } from 'react';

export default function BottomNav() {
  const pathname = usePathname()
  const hiddenRoutes = ['/login', '/signup']
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    setAuthToken(storageService.getAuthToken());
  }, []);

  if (hiddenRoutes.includes(pathname)) return null

  // Check if we are on a user-specific route
  const isUserRoute = pathname.startsWith('/user')

  const handleLogout = async () => {
    storageService.clearAuthData();
    await signOut(getAuth());
    window.location.href = '/login';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black text-white z-50 md:hidden">
      <div className="flex justify-around items-center h-15 w-full mx-auto">
        {/* Only show these links if not on user routes */}
        {!isUserRoute && (
          <>
            <Link
              href="#predefined"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${pathname === '/predefined-thalis' ? 'text-primary' : 'text-white'}`}
            >
              <Utensils className="h-6 w-6" />
              <span className="text-xs text-center">Special Thalis</span>
            </Link>

            <Link
              href="/user"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${pathname === '/customize-thali' ? 'text-primary' : 'text-white'}`}
            >
              <ChefHat className="h-6 w-6" />
              <span className="text-xs text-center">Create Thali</span>
            </Link>

            {!authToken ? (
              <Link
                href="/login"
                className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${pathname === '/orders' ? 'text-primary' : 'text-white'}`}
              >
                <ClipboardList className="h-6 w-6" />
                <span className="text-xs text-center">Login</span>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${pathname === '/orders' ? 'text-primary' : 'text-white'}`}
              >
                <LogOut className="h-6 w-6" />
                <span className="text-xs text-center">Logout</span>
              </button>
            )}
          </>
        )}

        {/* Show these links if on /user route */}
        {isUserRoute && (
          <>
            <Link
              href="/"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${pathname === '/user/predefined-thalis' ? 'text-primary' : 'text-white'}`}
            >
              <Utensils className="h-6 w-6" />
              <span className="text-xs text-center">Special Thalis</span>
            </Link>

            <Link
              href="/user"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${pathname === '/user/customize-thali' ? 'text-primary' : 'text-white'}`}
            >
              <ChefHat className="h-6 w-6" />
              <span className="text-xs text-center">Customize Thali</span>
            </Link>

            <Link
              href="/user/orderSummary"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${pathname === '/user/orders' ? 'text-primary' : 'text-white'}`}
            >
              <ClipboardList className="h-6 w-6" />
              <span className="text-xs text-center">Your Orders</span>
            </Link>

            <button
              onClick={handleLogout}
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${pathname === '/logout' ? 'text-primary' : 'text-white'}`}
            >
              <LogOut className="h-6 w-6" />
              <span className="text-xs text-center">Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  )
}