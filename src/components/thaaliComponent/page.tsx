"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/adminCard/page";
import { Button } from "../ui/button";
import Image from "next/image";
import { DishItem } from "@/types/menu";


interface ThaliCardProps {
  title: string;
  items: DishItem[];
  image: string;
  onClick: () => void;
  onDelete: () => void;
}

export function ThaliCard({
  title,
  items,
  image,
  onClick,
  onDelete,
}: ThaliCardProps) {
  

  return (
    <Card className="overflow-hidden bg-white rounded-lg border-2 border-black w-[307px] h-[500px]">
      <div className="p-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-black">{title}</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => {}}
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gray-300"
            >
              <Pencil className="h-4 w-4 text-black" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 bg-white border-gray-300 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{item.name}</span>
              <span className="font-bold text-black">₹ {item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Image Section */}
      <div className="relative w-full h-[200px]">
        <Image
          src={image}
          alt={title}
          width={307}
          height={307}
          className="object-cover"
        />
      </div>
    </Card>
  );
}
