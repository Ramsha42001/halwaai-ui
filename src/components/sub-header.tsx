"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const headerItems = [
  "Update Menu Items",
  "Update Predefined Thalis",
  "Update Modal",
];

export default function SubHeader() {
  const [activeCategory, setActiveCategory] = useState("Update Menu Items");
  const router = useRouter(); // Initialize useRouter

  return (
    <div className="bg-[#000000] flex flex-wrap justify-center mt-[70px] items-center gap-2 md:gap-4 p-4 text-[black]">
      {headerItems.map((category) => (
        <Button
          key={category}
          variant="ghost"
          className={cn(
            "text-white hover:text-white hover:bg-transparent px-3 py-1",
            activeCategory === category && "bg-[#D74E26]"
          )}
          onClick={() => {
            setActiveCategory(category);
            if (category === "Update Predefined Thalis") {
              router.push("/admin/predefinedThaalis"); 
            }
            else if(category === "Update Menu Items"){
              router.push("/admin");
            }
          }}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
