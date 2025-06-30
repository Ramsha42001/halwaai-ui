"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/adminCard/page";
import { Button } from "../ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { menuItems } from "@/data/menu-items";
import { useStore } from '@/services/store/menuItemsStore';
import predefinedThaliService from "@/services/api/predefinedThaliService";
import { storageService } from "@/utils/storage"

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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);


  const { addSpecialThaliToCart, cart } = useStore();

  useEffect(() => {
    setIsClient(true);
    setAuthToken(storageService.getAuthToken());
    setUsername(storageService.getUsername());
  }, []);


  // Check if this thali is already in cart and get its quantity
  useEffect(() => {
    if (_id && cart) {
      const existingItem = cart.items.find(
        item => item.type === 'special' && (item.thali as any)._id === _id
      );
      if (existingItem) {
        setQuantity(existingItem.cartQuantity);
      }
    }
  }, [_id, cart]);

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

  const handleAddThaliToCart = async () => {
    if (!_id) {
      console.error('Thali ID is required');
      return;
    }

    setIsAddingToCart(true);
    try {
      const userId = localStorage.getItem('authToken');

      // Create special thali object
      const specialThali = {
        _id,
        name: title,
        menuItems: items.map(item => ({
          ...item,
          description: '',
          imageUrl: '',
          category: { _id: '', name: '' },
          hasButter: false
        })),
        thaliPrice: price,
        thaliQuantity: items.reduce((sum, item) => sum + item.quantity, 0)
      };

      // Add to cart using store function
      await addSpecialThaliToCart(userId, specialThali);

      // Update local quantity
      setQuantity(quantity + 1);

      alert('Thali added to cart successfully!');
    } catch (error) {
      console.error('Error adding thali to cart:', error);
      alert('Failed to add thali to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const increaseQuantity = async () => {
    await handleAddThaliToCart();
  };

  const decreaseQuantity = async () => {
    if (quantity > 0 && _id) {
      try {
        const userId = localStorage.getItem('authToken');
        const { cart, updateCartItemQuantity } = useStore.getState();

        // Find the cart item index
        const itemIndex = cart.items.findIndex(
          item => item.type === 'special' && (item.thali as any)._id === _id
        );

        if (itemIndex !== -1) {
          // Update quantity in cart
          await updateCartItemQuantity(userId, itemIndex, cart.items[itemIndex].cartQuantity - 1);
          setQuantity(quantity - 1);
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity');
      }
    }
  };

  return (
    <>
      <div className="relative w-[90%] sm:w-[350px] min-h-[500px] h-auto mx-auto my-[10px]">
        <div className="relative w-[250px] h-[250px] mx-auto my-0 bg-[white] rounded-full z-10">
          <img src={image} alt={image} className="object-cover w-[100%] h-[100%] rounded-full" />
          {showButton && (
            <div onClick={openDialog} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 border-rounded rounded-[100%]">
              <span className="text-white">Upload Image</span>
            </div>
          )}
        </div>

        <Card style={{ height: `calc(100% - 125px)`, width: '100%', paddingTop: '130px', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px' }} className="absolute bottom-0 left-0 bg-[#997864] text-white border-none h-auto">
          <CardHeader className="flex flex-row justify-between items-start">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-sm opacity-90">₹{price}</p>
          </CardHeader>
          <CardContent className="space-y-2 flex-grow">
            {items.map((item, idx) => (
              <div key={item._id} className="flex items-center gap-3 flex-row justify-between">
                <span className="text-sm">{item.name}</span>
                <span className="text-sm">{item.quantity}</span>
              </div>
            ))}
          </CardContent>
          {showButton && quantity <= 0 ? (
            <div className="flex flex-row justify-right mx-[10px]">
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
            </div>
          ) : quantity == 0 && authToken ? (
            <div className="absolute bottom-2 right-2 flex items-center">
              <Button
                className="mt-4 bg-black hover:bg-gray-800 flex items-center mx-[10px]"
                onClick={handleAddThaliToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? 'Adding...' : 'Add Thali'}
              </Button>
            </div>
          ) : authToken ? (
            <div className="absolute bottom-2 right-2 flex items-center">
              <Button
                className="bg-black hover:bg-gray-800 text-white"
                onClick={increaseQuantity}
                disabled={isAddingToCart}
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
            </div>
          ) : <></>}
        </Card>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-white p-4 rounded">
            <h2 className="text-lg font-semibold text-black">Upload or update Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 text-black"
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