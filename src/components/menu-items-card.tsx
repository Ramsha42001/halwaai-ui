import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { CustomPopup } from "@/components/popup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
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
  const [isEditFormOpen, setIsEditFormOpen] = useState(false); 
  const [selectedImage, setSelectedImage] = useState<File | null>(null); 
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
            <Button onClick={() => setIsEditFormOpen(true)}  size="icon" variant="outline" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            <CustomPopup
              isOpen={isEditFormOpen}
              onClose={() => setIsEditFormOpen(false)}
              title="Edit Menu Item"
              className="sm:max-w-[500px] bg-[#fff5f5] text-black"
              footer={
                <Button
                  className="text-black"
                  onClick={() => setIsEditFormOpen(false)}
                  variant="default"
                >
                  Submit
                </Button>
              }
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="name">
                    Name
                  </Label>
                  <Input id="name" placeholder="Enter name of the item" />
                </div>

                <div className="space-y-2">
                  <Label className="text-black" htmlFor="price">
                    Price(₹)
                  </Label>
                  <Input id="price" type="number" placeholder="Enter price" />
                </div>

                <div className="space-y-2">
                  <Label className="text-black" htmlFor="description">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-[#fff5f5]"
                    placeholder="Enter your description"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-black">Image</Label>
                  <ImageUpload
                    value={selectedImage}
                    onChange={setSelectedImage}
                  />
                </div>
              </div>
            </CustomPopup>
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
