"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  return (
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
  );
}
