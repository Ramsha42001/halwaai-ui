"use client";

import { Pencil, Trash2, Plus, Minus, Upload, X } from "lucide-react";
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

  console.log(items)

  // Check if this thali is already in cart and get its quantity
  useEffect(() => {
    if (_id && cart && cart.items) {
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
      {/* Responsive Container */}
      <div className="relative w-full mx-auto group">
        {/* Image Section - Overlapping */}
        <div className="relative z-10 mb-[-50px] sm:mb-[-60px] md:mb-[-70px]">
          <div className="relative w-[200px] sm:w-[220px] md:w-[240px] h-[200px] sm:h-[220px] md:h-[240px] mx-auto">
            <div className="w-full h-full bg-white rounded-full shadow-lg overflow-hidden border-2 border-white">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Minimal Upload Overlay */}
              {showButton && (
                <div
                  onClick={openDialog}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer backdrop-blur-sm"
                >
                  <Upload className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Content - Minimal Design with Flexbox Layout */}
        <Card className="bg-[#997864] min-h-[450px] text-white border-none shadow-lg hover:shadow-xl transition-shadow duration-300 pt-[60px] sm:pt-[70px] md:pt-[80px] flex flex-col">
          {/* Header */}
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-white truncate mb-1">
                  {title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                  {description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold text-white">₹{price}</p>
                  <p className="text-xs text-white/70">Total</p>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Menu Items - Clean List with flex-grow */}
          <CardContent className="py-3 flex-grow">
            <h4 className="text-sm font-medium text-white/90 mb-3">Includes:</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {items.map((item, idx) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-1 text-sm"
                >
                  <span className="text-white/90 truncate mr-2">{item.name}</span>
                  <span className="text-white font-medium flex-shrink-0">×{item.quantity}</span>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Action Buttons - Fixed at Bottom */}
          <div className="p-4 pt-2 flex-shrink-0 mt-auto">
            {/* Admin Buttons Row - Only show if showButton is true */}
            {showButton && (
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <Button
                  className="flex-1 bg-black/30 hover:bg-black/50 text-white border border-white/20 transition-colors duration-200"
                  onClick={onClick}
                  size="sm"
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  className="flex-1 bg-red-600/80 hover:bg-red-600 text-white transition-colors duration-200"
                  onClick={onDelete}
                  size="sm"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}

            {/* Cart Action Buttons - Always visible when authenticated */}
            {authToken && (
              <>
                {quantity === 0 ? (
                  <Button
                    className="w-full bg-black/30 hover:bg-black/50 text-white border border-white/20 transition-colors duration-200"
                    onClick={handleAddThaliToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      className="w-8 h-8 p-0 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-colors duration-200"
                      onClick={decreaseQuantity}
                      disabled={isAddingToCart}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>

                    <span className="text-lg font-semibold text-white min-w-[2rem] text-center">
                      {quantity}
                    </span>

                    <Button
                      className="w-8 h-8 p-0 bg-green-600/80 hover:bg-green-600 text-white rounded-full transition-colors duration-200"
                      onClick={increaseQuantity}
                      disabled={isAddingToCart}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Minimal Upload Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>
              <button
                onClick={closeDialog}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#997864] transition-colors duration-200">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-[#997864] text-sm font-medium hover:text-[#8b6f5c] transition-colors duration-200"
                >
                  Choose file
                </label>
                {selectedImage && (
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {selectedImage.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={closeDialog}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 border-0"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImageUpload}
                  className="flex-1 bg-[#997864] hover:bg-[#8b6f5c] text-white"
                  disabled={!selectedImage}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}