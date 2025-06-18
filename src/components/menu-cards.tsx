"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface MenuCategoriesProps {
  onCategoryChange: (category: string) => void;
  categories: { _id: string, name: string }[];
}

export default function MenuCategories({ onCategoryChange, categories }: MenuCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Set initial active category to first category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]._id);
      onCategoryChange(categories[0]._id);
    }
  }, [categories]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    onCategoryChange(category);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full">
      {isMobile ? (
        <div className="relative items-center w-full">
          <Button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            variant="outline" 
            className="bg-black text-white hover:bg-background w-full text-left justify-between"
          >
            {isDropdownOpen ? "Close" : categories.find(c => c._id === activeCategory)?.name || "Select Category"}
          </Button>
          {isDropdownOpen && (
            <div className="absolute top-12 left-0 w-full bg-white z-10 rounded-lg shadow-md">
              {categories.map((category) => (
                <Button
                  key={category._id}
                  variant="ghost"
                  className="text-black hover:text-black hover:bg-gray-100 block w-full text-left"
                  onClick={() => handleCategoryClick(category._id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] flex flex-wrap justify-center gap-2 md:gap-4 rounded-lg p-2">
          {categories.map((category) => (
            <Button
              key={category._id}
              variant="ghost"
              className={cn(
                "text-white hover:text-white hover:bg-transparent px-3 py-1",
                activeCategory === category._id && "bg-[#D74E26]"
              )}
              onClick={() => handleCategoryClick(category._id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
