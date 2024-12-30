'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Utensils, ChefHat, LogIn } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black text-white z-50 md:hidden">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto">
        <Link 
          href="/predefined-thalis"
          className={`flex flex-col items-center space-y-1 w-1/3 p-2 ${
            pathname === '/predefined-thalis' ? 'text-primary' : 'text-white'
          }`}
        >
          <Utensils className="h-6 w-6" />
          <span className="text-xs text-center">Predefined Thalis</span>
        </Link>

        <Link 
          href="/customize-thali"
          className={`flex flex-col items-center space-y-1 w-1/3 p-2 ${
            pathname === '/customize-thali' ? 'text-primary' : 'text-white'
          }`}
        >
          <ChefHat className="h-6 w-6" />
          <span className="text-xs text-center">Customize Thali</span>
        </Link>

        <Link 
          href="/login"
          className={`flex flex-col items-center space-y-1 w-1/3 p-2 ${
            pathname === '/login' ? 'text-primary' : 'text-white'
          }`}
        >
          <LogIn className="h-6 w-6" />
          <span className="text-xs text-center">Login</span>
        </Link>
      </div>
    </nav>
  )
}

