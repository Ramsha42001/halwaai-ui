import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface MenuItemCardProps {
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function MenuItemCard({
  title,
  description,
  price,
  image,
}: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-[150px] sm:h-[200px]">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">{title}</h3>
        <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg md:text-2xl font-bold">₹{price}</span>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 bg-[#D84315] hover:bg-[#BF360C]"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
