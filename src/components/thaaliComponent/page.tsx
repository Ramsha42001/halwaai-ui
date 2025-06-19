"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/adminCard/page";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { menuItems } from "@/data/menu-items";
import { cartService } from "@/services/api/cartService";
import predefinedThaliService from "@/services/api/predefinedThaliService";
interface MenuItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ThaliCardProps {
  _id?: string;
  title: string;
  description: string;
  items: MenuItem[];
  image: string;
  price: number;
  onClick?: () => void;
  onDelete?: () => void;
  showButton: boolean;
}

export function ThaliCard({
  _id,
  title,
  description,
  items,
  image,
  price,
  onClick,
  onDelete,
  showButton
}: ThaliCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedThali = JSON.parse(localStorage.getItem('selectedThali') || '{}');

  useEffect(() => {
    const selectedThaliString = localStorage.getItem('selectedThali');
    if (selectedThaliString) {
      const selectedThali = JSON.parse(selectedThaliString);
      setQuantity(selectedThali.quantity || 0);
    }
  }, []);

  const handlePredefinedThaliItem = (thaliData: any) => {
    setQuantity(quantity + 1);
    localStorage.setItem('selectedThali', JSON.stringify({
      _id: thaliData._id,
      title: thaliData.title,
      description: thaliData.description,
      items: thaliData.items,
      image: thaliData.image,
      price: thaliData.price,
      quantity: quantity + 1
    }));
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    await uploadImage();
    setIsDialogOpen(false);
    window.location.reload();
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      throw new Error('A valid image file must be provided to update the image.');
    }

    if (!_id) {
      throw new Error('Thali ID is required to upload the image.');
    }
    const response = await predefinedThaliService.uploadImage(_id, selectedImage);
    return response;
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedImage(null);
  };

  const thaliToCart = async () => {
    const payload = {
      thaliTitle: selectedThali.title,
      menuItems: selectedThali.items.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      thaaliTotalPrice: selectedThali.price,
      thaliquantity: selectedThali.quantity
    }

    console.log(payload);
    await cartService.addToCart(payload);
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1);

    const selectedThaliString = localStorage.getItem('selectedThali');
    if (selectedThaliString) {
      const selectedThali = JSON.parse(selectedThaliString);
      selectedThali.quantity += 1;
      localStorage.setItem('selectedThali', JSON.stringify(selectedThali));
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);

      const selectedThaliString = localStorage.getItem('selectedThali');
      if (selectedThaliString) {
        const selectedThali = JSON.parse(selectedThaliString);
        selectedThali.quantity = Math.max(0, selectedThali.quantity - 1);
        localStorage.setItem('selectedThali', JSON.stringify(selectedThali));
      }
    }
  }

  return (
    <>
      <div className="relative w-[400px] min-h-[500px] h-auto mx-[20px]">
        <div className="absolute overflow-hidden w-[300px] h-[300px] bg-[white] border-[2px] border-[black] mx-[50px] rounded-full">
          <img src={image} alt={image} className="object-cover w-[100%] h-[100%]" />
          <div onClick={openDialog} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <span className="text-white">Upload Image</span>
          </div>
        </div>

        <Card className="bg-[#997864] text-white border-none min-h-[350px] h-auto mt-[150px] pb-[5%]">
          <CardHeader className="pt-[170px] flex flex-row justify-between items-start">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-sm opacity-90">₹{price}</p>
          </CardHeader>
          <CardContent className="space-y-2 flex-grow">
            {Object.entries(items).map(([category, item], idx) => (
              <div key={item._id} className="flex items-center gap-3 flex-row justify-between">
                <span className="text-sm">{item.name}</span>
                <span className="text-sm">{item.quantity}</span>
              </div>
            ))}
          </CardContent>
          {showButton && quantity <= 0 ? (
            <><div className="flex flex-row justify-right mx-[10px]">
              <Button
                className="mt-4 bg-black hover:bg-gray-800 flex items-center mx-[10px]"
                onClick={onClick}
              >
                Edit Thali
              </Button>
              <Button
                className="mt-4 bg-black hover:bg-gray-800 flex items-center"
                onClick={onDelete}
              >
                Delete Thali
              </Button>
            </div></>
          ) : quantity <= 0 ? (
            <Button
              className="mt-4 bg-black hover:bg-gray-800 flex items-center mx-[10px]"
              onClick={() => {
                handlePredefinedThaliItem({
                  _id,
                  title,
                  description,
                  items,
                  image,
                  price
                });
                thaliToCart();
              }}
            >
              Add Thali
            </Button>
          ) : <div className="absolute bottom-2 left-2 flex items-center">
            <Button
              className="bg-black hover:bg-gray-800 text-white"
              onClick={increaseQuantity}
            >
              +
            </Button>
            <span className="mx-2 text-white">{quantity}</span>
            <Button
              className="bg-black hover:bg-gray-800 text-white"
              onClick={decreaseQuantity}
            >
              -
            </Button>
          </div>}
        </Card>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <h2 className="text-lg font-semibold">Upload Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleImageUpload} className="bg-blue-500 text-white">
                Upload
              </Button>
              <Button onClick={closeDialog} className="ml-2 bg-gray-300">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
