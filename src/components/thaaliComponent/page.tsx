"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/adminCard/page";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { menuItems } from "@/data/menu-items";
import { cartService } from "@/services/api/cartService";

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

  const selectedThali = JSON.parse(localStorage.getItem('selectedThali'));

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

  const uploadImage = async () => {
    console.log('upload image function')
  }

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

    console.log(payload); // Log the entire payload to see its structure
    await cartService.addToCart(payload);
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1);

    const selectedThaliString = localStorage.getItem('selectedThali');
    if (selectedThaliString) {
      const selectedThali = JSON.parse(selectedThaliString);
      selectedThali.quantity += 1; // Increment the quantity
      localStorage.setItem('selectedThali', JSON.stringify(selectedThali));
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);

      const selectedThaliString = localStorage.getItem('selectedThali');
      if (selectedThaliString) {
        const selectedThali = JSON.parse(selectedThaliString);
        selectedThali.quantity = Math.max(0, selectedThali.quantity - 1); // Decrement the quantity
        localStorage.setItem('selectedThali', JSON.stringify(selectedThali));
      }
    }
  }

  return (
    <>

      <div className="relative w-[400px] min-h-[500px] h-auto mx-[20px]">
        <div className="absolute overflow-hidden  w-[300px] h-[300px] bg-[white] border-[2px] border-[black] mx-[50px] rounded-full">
          <img src={image} alt={image} className="object-cover w-[100%] h-[100%]" />
          <div onClick={uploadImage} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <span className="text-white">Upload Image</span> {/* Replace with your desired content */}
          </div>
        </div>

        <Card className="bg-[#997864] text-white border-none min-h-[350px] h-auto mt-[150px] pb-[5%]">
          <CardHeader className="pt-[170px]  flex flex-row justify-between items-start">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-sm opacity-90">₹{price}</p>
          </CardHeader>
          <CardContent className="space-y-2 flex-grow">
            {Object.entries(items).map(([category, item], idx) => (
              <div key={item._id} className="flex items-center gap-3 flex-row justify-between">
                {/* {menuItems[idx].icon}  */}
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

    </>
  );
}
