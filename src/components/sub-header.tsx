"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";


const headerItems = [
  "Update Menu Items",
  "Update Predefined Thalis",
  "Update Modal",
];

export default function SubHeader() {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState("");
  const router = useRouter();

  useEffect(() => {
    switch (pathname) {
      case "/admin/menuItems":
        setActiveCategory("Update Menu Items");
        break;
      case "/admin/predefinedThaalis":
        setActiveCategory("Update Predefined Thalis");
        break;
      case "/admin/modalManagement":
        setActiveCategory("Update Modal");
        break;
      default:  // Or handle other cases as needed. You might set a default active category here
        setActiveCategory("");
    }
  }, [pathname]);


  const handleClick = (category: string) => {
    setActiveCategory(category);
    if (category === "Update Predefined Thalis") {
      router.push("/admin/predefinedThaalis");
    } else if (category === "Update Menu Items") {
      router.push("/admin/menuItems");
    } else if(category === "Update Modal"){
      router.push("/admin/modalManagement")
    }

  };

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
          onClick={() => handleClick(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}

