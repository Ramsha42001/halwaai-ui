'use client'

import { Button } from "@/components/ui/button"
import { Eye } from 'lucide-react'
import { useState, useEffect } from 'react';

const categories = [
  { id: "breads", name: "Breads" },
  { id: "appetizers", name: "Appetizers" },
  { id: "rice", name: "Rice" },
  { id: "sabzi", name: "Sabzi" },
  { id: "paneer", name: "Paneer & Subs" },
  { id: "dal", name: "Dal" },
  { id: "beverages", name: "Beverages" },
  { id: "add-ons", name: "Add-Ons" }
];

export function MenuBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-[#2C2C2C] text-white p-4 flex items-center justify-between overflow-x-auto relative"> {/* Added relative for positioning */}
      
       {isMobile ? ( 
        <div className="relative w-full"> {/* Dropdown container takes full width on mobile */}
          <Button onClick={toggleDropdown} variant="outline" className="bg-black text-white hover:bg-black/90 w-full text-left justify-between"> {/* Updated button styles */}
            {isDropdownOpen ? "Close Menu"  : "Select a Category"}
          </Button>

          {isDropdownOpen && (
            <div className="absolute top-12 left-0 w-full bg-black z-10 rounded-lg">
                {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant="ghost"
                      className="text-white hover:text-white/70 hover:bg-background block w-full text-left" 
                      onClick={() => {
                        //Handle Category Selection
                        console.log("Selected:", category.name);
                        setIsDropdownOpen(false); // Close dropdown after selection
                      }}
                    >
                      {category.name}
                    </Button>
                  ))}

            </div>
          )}
        </div>
      ) : (
         <div className="flex space-x-4"> {/* Desktop View */}
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className="text-white hover:text-white/70 hover:bg-background"
              >
                {category.name}
              </Button>
            ))}
          </div>
      )}



      {/* View Thali Button */}
      <Button variant="outline" className="bg-black text-white hover:bg-black/90 whitespace-nowrap"> {/* Added whitespace-nowrap */}
        <Eye className="mr-2 h-4 w-4" />
        View Thali
      </Button>
    </div>
  )
}
