'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Utensils, ChefHat, LogIn } from 'lucide-react'

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black text-white z-50 md:hidden">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto">
        <Link 
          href="/admin/predefinedThaalis"
          className={`flex flex-col items-center space-y-1 w-1/3 p-2 ${
            pathname === '/admin/predefinedThaalis' ? 'text-primary' : 'text-white'
          }`}
        >
          <span className="text-xs text-center">Update Predefined Thalis</span>
        </Link>

        <Link 
          href="/admin/menuItems"
          className={`flex flex-col items-center space-y-1 w-1/3 p-2 ${
            pathname === '/admin/menuItems' ? 'text-primary' : 'text-white'
          }`}
        >
          <span className="text-xs text-center">Update Menu Items</span>
        </Link>

        <Link 
          href="/admin/modalManagement"
          className={`flex flex-col items-center space-y-1 w-1/3 p-2 ${
            pathname === '/login' ? 'text-primary' : 'text-white'
          }`}
        >
          <span className="text-xs text-center">Update Modal Management</span>
        </Link>
      </div>
    </nav>
  )
}

