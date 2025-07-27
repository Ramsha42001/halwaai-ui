import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { CustomPopup } from "@/components/popup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { menuItemService } from "@/services/api/menuItemService";
import { toast } from "sonner";

interface MenuItemCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  onUpdate?: () => void;
}

export default function MenuItemCard({
  id,
  title,
  description,
  price,
  image,
  category,
  onUpdate
}: MenuItemCardProps) {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: title,
    description: description,
    price: price,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'price' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());

      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      const response = await menuItemService.updateMenuItem(id, formDataToSend);

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
            <Button
              onClick={() => setIsEditFormOpen(true)}
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={isDeleting}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <CustomPopup
              isOpen={isEditFormOpen}
              onClose={() => setIsEditFormOpen(false)}
              title="Edit Menu Item"
              className="sm:max-w-[500px] bg-[#fff5f5] text-black"
              footer={
                <div className="flex justify-end gap-2">
                  {error && <span className="text-red-500 mr-auto">{error}</span>}
                  <Button
                    onClick={() => setIsEditFormOpen(false)}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
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
              onClick={() => deleteMenuItem(id)}
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
        </div>
      </div>
    </Card>
  );
}
