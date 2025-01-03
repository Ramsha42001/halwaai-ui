"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";


const categories = [
  "Deserts",
  "Appetizers",
  "Rice",
  "Sabzi",
  "Paneer ki Sabzi",
  "Dal",
  "Desert",
  "Beverages",
  "Add-Ons",
];

export default function MenuCategories() {
  const [activeCategory, setActiveCategory] = useState("Deserts");
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);


  return (
    <div className="relative w-full"> {/* Added relative for positioning */}
      {isMobile ? (
        <div className="relative items-center w-full">
            <Button onClick={toggleDropdown} variant="outline" className="bg-black text-white hover:bg-background w-full text-left justify-between"> {/* Button to toggle dropdown */}
              {isDropdownOpen ? "Close" : activeCategory || "Select Category"} {/* Display active category or placeholder */}
            </Button>
            {isDropdownOpen && ( // Show dropdown content when open
              <div className="absolute top-12 left-0 w-full bg-white z-10 rounded-lg shadow-md">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className="text-black hover:text-black hover:bg-gray-100 block w-full text-left"
                    onClick={() => {
                      setActiveCategory(category);
                      toggleDropdown(); // Close dropdown after selection
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        
      ) : (
      <div className="bg-[#1a1a1a] flex flex-wrap justify-center gap-2 md:gap-4 rounded-lg p-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            className={cn(
              "text-white hover:text-white hover:bg-transparent px-3 py-1",
              activeCategory === category && "bg-[#D74E26]"
            )}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      )}
    </div>
  );
}
