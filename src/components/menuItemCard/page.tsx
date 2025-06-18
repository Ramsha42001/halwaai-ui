'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus } from 'lucide-react'
import { useState, useEffect } from "react"
import { YesNoToggle } from "../toggle/page"
import Image from "next/image"
import { storageService } from "@/utils/storage"
import { useStore } from '@/services/store/menuItemsStore';
import { CustomPopup } from "@/components/popup";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { menuItemService } from "@/services/api/menuItemService";
import { toast } from "sonner";
interface MenuItemProps {
  id?: string;
  name?: string;
  description: string;
  image: string;
  price: number;
  isSelected?: boolean;
  category?: string;
  isAdminPage: boolean;
  onUpdate?: () => void;
  // quantity?: number; 
  requiredCategory?: RequiredCategoryItems[];
  onQuantityChange?: (id: string | undefined, quantity: number) => void;
}

interface RequiredCategoryItems {
  _id: string,
  selectedForThali: boolean
}



export function MenuItemCard({
  id,
  name,
  description,
  image,
  price,
  isSelected = false,
  category,
  onQuantityChange,
  requiredCategory,
  isAdminPage,
  onUpdate
}: MenuItemProps) {

  const { selectedItems, addItem, removeItem } = useStore();
  const [quantity, setQuantity] = useState(id ? selectedItems.get(id) || 0 : 0);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: name,
    description: description,
    price: price,
  });

  useEffect(() => {
    if (id)
      setQuantity(selectedItems.get(id) || 0)
  }, [selectedItems, id])


  //Functions 
  const handleItemAddition = () => {
    if (id && category)
      addItem(id, category);
    // calculateThaliProgress();
  };

  const handleItemRemoval = () => {
    if (id && category)
      removeItem(id, category);
    // calculateThaliProgress();
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'price' ? parseFloat(value) : value
    }));
  };

  const deleteMenuItem = async (id: string) => {
    try {
      setIsDeleting(true);
      setError("");

      const response = await menuItemService.deleteMenuItem(id);

      if (response) {
        toast.success("Menu item deleted successfully");
        if (onUpdate) {
          await onUpdate();
        }
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setError("Failed to delete menu item");
      toast.error("Failed to delete menu item");
    } finally {
      setIsDeleting(false);
    }
  };


  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name || '');
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());

      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      let response: any = '';
      if (id) {
        response = await menuItemService.updateMenuItem(id, formDataToSend);
      }


      if (response) {
        setIsEditFormOpen(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      setError("Failed to update menu item");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`bg-[#997864] border-[1px] border-[black] w-full md:w-[350px] mb-[10px] relative
      ${isSelected ? 'ring-2 ring-black' : ''}`}>
      <CardContent className="p-4">
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-white bg-opacity-60 rounded-lg p-1 flex items-center gap-2">
            {!isAdminPage && (<><div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleItemRemoval()}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span>{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleItemAddition()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div></>)}

          </div>
        </div>

        <div className="cursor-pointer">
          <div className="relative">
            <div
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '192px',
                borderRadius: '0.5rem',
                filter: 'brightness(0.9)', // Optional: Add a brightness filter
              }}
              className="rounded-lg overflow-hidden" // Optional: Add rounded corners
            />
          </div>
          <div className="mt-4">
            <h3 className="font-medium text-xl text-white font-poorStory">{name}</h3>
            <p className="text-white/90 text-sm font-poppins">{description}</p>
            <p className="text-white mt-2 font-semibold">₹{price}</p>
          </div>

          {(isAdminPage && (<>  <div className="flex gap-2 justify-end">
            <Button
              onClick={() => setIsEditFormOpen(true)}
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={isDeleting}
              style={{ backgroundColor: 'transparent', color: 'black', border: '1px solid black' }}
            >
              <Pencil className="h-4 w-4 " />
            </Button>
            <CustomPopup
              isOpen={isEditFormOpen}
              onClose={() => setIsEditFormOpen(false)}
              title="Edit Menu Item"
              className="sm:max-w-[500px] bg-[#fff5f5] text-black"
              footer={
                <div className="flex justify-end gap-2">
                  {error && <span className="text-red-500 mr-auto">{error}</span>}
                  {/* <Button
                    onClick={() => setIsEditFormOpen(false)}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button> */}
                  <Button
                    onClick={handleSubmit}
                    variant="default"
                    disabled={isLoading}
                    className="text-black"
                  >
                    {isLoading ? "Updating..." : "Update"}
                  </Button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-black" htmlFor="name">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name of the item"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-black" htmlFor="price">
                    Price(₹)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-black" htmlFor="description">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-[#fff5f5]"
                    value={formData.description}
                    onChange={handleInputChange}
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
              onClick={() => id && deleteMenuItem(id)}
              size="icon"
              variant="destructive"
              className="h-8 w-8 bg-[#D84315] hover:bg-[#BF360C]"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          </>))}
        </div>

      </CardContent>
    </Card>
  );
}
