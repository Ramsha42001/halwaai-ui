'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Utensils, ChefHat, ClipboardList, User, LogOut } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()
  const hiddenRoutes = ['/login', '/signup']
  
  if (hiddenRoutes.includes(pathname)) return null

  // Check if we are on a user-specific route
  const isUserRoute = pathname.startsWith('/user')

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black text-white z-50 md:hidden">
      <div className="flex justify-around items-center h-20 w-full mx-auto">
        {/* Only show these links if not on user routes */}
        {!isUserRoute && (
          <>
            <Link 
              href="#predefined"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${
                pathname === '/predefined-thalis' ? 'text-primary' : 'text-white'
              }`}
            >
              <Utensils className="h-6 w-6" />
              <span className="text-xs text-center">Predefined Thalis</span>
            </Link>

            <Link 
              href="/user"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${
                pathname === '/customize-thali' ? 'text-primary' : 'text-white'
              }`}
            >
              <ChefHat className="h-6 w-6" />
              <span className="text-xs text-center">Customize Thali</span>
            </Link>

            <Link 
              href="/user/history"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${
                pathname === '/orders' ? 'text-primary' : 'text-white'
              }`}
            >
              <ClipboardList className="h-6 w-6" />
              <span className="text-xs text-center">Your Orders</span>
            </Link>
          </>
        )}

        {/* Show these links if on /user route */}
        {isUserRoute && (
          <>
            <Link 
              href="#predefined"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${
                pathname === '/user/predefined-thalis' ? 'text-primary' : 'text-white'
              }`}
            >
              <Utensils className="h-6 w-6" />
              <span className="text-xs text-center">Predefined Thalis</span>
            </Link>

            <Link 
              href="/user"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${
                pathname === '/user/customize-thali' ? 'text-primary' : 'text-white'
              }`}
            >
              <ChefHat className="h-6 w-6" />
              <span className="text-xs text-center">Customize Thali</span>
            </Link>

            <Link 
              href="/user/history"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${
                pathname === '/user/orders' ? 'text-primary' : 'text-white'
              }`}
            >
              <ClipboardList className="h-6 w-6" />
              <span className="text-xs text-center">Your Orders</span>
            </Link>

            {/* Add a Logout button */}
            <Link 
              href="/"
              className={`flex flex-col items-center space-y-1 w-1/4 p-2 ${
                pathname === '/logout' ? 'text-primary' : 'text-white'
              }`}
            >
              <LogOut className="h-6 w-6" />
              <span className="text-xs text-center">Logout</span>
            </Link>
          </>
        )}

        {/* User Profile Link (common for all routes) */}
      </div>
    </nav>
  )
}
