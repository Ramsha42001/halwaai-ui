'use client'

import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { menuItemService } from '@/services/api/menuItemService';
import { useSearchParams } from 'next/navigation';
import { cartService } from '@/services/api/cartService';
import { useStore } from '@/services/store/menuItemsStore'
import { CustomPopup } from "@/components/popup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MenuItem {
  _id: string
  name: string
  description: string
  imageUrl: string
  price: number
  category: {
    _id: string
    name: string
  }
  hasButter?: boolean
  quantity: number
}

export default function Thali() {
  const searchParams = useSearchParams();
  const selectedItemIds = searchParams.get('items')?.split(',') || [];
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dialog, setdialog] = useState(false);
  const [thaliName, setThaliName] = useState('');


  const handleOpenThaliNameDialog = async () => {
    setdialog(!dialog);

  }
  useEffect(() => {
    menuItemService.getMenuItems().then((response) => {
      setMenuItems(response)
    })
  }, [])


  const handleAddToCart = async () => {
    const menuItemsArray = filteredSelectedMenuItems.map(item => ({
      name: item.name,        // Required: Name of the menu item
      price: item.price,      // Required: Price of the menu item
      quantity: item.quantity  // Required: Quantity of the menu item
    }));

    const payload = {
      userId: localStorage.getItem('userId'), // Ensure this is not null
      thaaliTitle: thaliName,                  // Required: Title of the thali
      menuItems: menuItemsArray,                // Required: Array of menu items
      thaaliTotalPrice: orderTotal,             // Required: Total price of the thali
      thaliquantity: filteredSelectedMenuItems.length // Required: Total number of selected items
    };

    // Check if userId is valid before sending the request
    if (!payload.userId) {
      console.error("User ID is required.");
      return;
    }

    const response = await cartService.addToCart(payload);
    console.log(response);
  }


  // Calculate total order amount
  const { selectedItems, setOrderTotal } = useStore();
  // const orderTotal = selectedItems.reduce((sum, { item, quantity }) => sum + (item.price * quantity), 0);
  const filteredSelectedMenuItems = menuItems.filter(item =>
    item && item._id && Array.from(selectedItems.keys()).includes(item._id) // Ensure item is not null and has _id
  ).map(item => ({
    ...item,
    quantity: selectedItems.get(item._id) || 0,
    name: item.name,
    description: item.description,
    price: item.price,
    butter: item.hasButter,
  }));

  const orderTotal = filteredSelectedMenuItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Update orderTotal in store whenever it changes
  useEffect(() => {
    setOrderTotal(orderTotal);
  }, [orderTotal, setOrderTotal]);

  return (
    <div className="flex flex-col min-h-screen mt-[70px] text-[black] pb-[40%] sm:pb-[40%] lg:pb-[5%]">
      <div className="container mx-auto px-4">
        <Link href="/user">
          <Button variant="default" className="bg-black hover:text-[black] my-4">
            <ChevronLeft className="mr-2" />Back
          </Button>
        </Link>

        <h2 className="font-poorStory font-semibold text-2xl md:text-3xl text-[black] py-4 md:py-[20px] text-center">
          Selected Items In The Thali
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 pb-32">
          {/* Thali Image */}
          <div className="w-full lg:w-[40%] flex justify-center items-start">
            <div className="relative w-full max-w-md aspect-square">
              <img
                src="/images/thali1.png"
                alt="Thali"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Menu Items */}
          <div className="w-full lg:w-[60%]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSelectedMenuItems.map((item) => (
                <div
                  key={item._id}
                  className="p-4 border-[2px] border-[black] rounded-md bg-[white] h-auto"
                >
                  <div className="flex flex-row w-full justify-between items-start">
                    <h5 className="font-bold text-lg">{item.name}</h5>
                    <h5 className="font-bold text-lg">₹{item.price}</h5>
                  </div>
                  <p className="font-medium text-sm mt-2 text-gray-600">{item.description}</p>
                  <p className="font-medium text-sm mt-2 text-gray-600">Quantity: {item.quantity}</p>
                  {item.butter ? <p className="font-medium text-sm mt-2 text-gray-600">With Butter</p> : <></>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Total and Action Buttons */}
      <div className="fixed bottom-[70px] sm:bottom-[70px] lg:bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="border-2 border-black rounded-md px-4 py-2 w-full sm:w-auto text-center">
              <span className="font-bold text-[black]">Order Total: ₹{orderTotal}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2 w-full sm:w-auto"
                onClick={handleOpenThaliNameDialog}
              >
                Add to Cart
              </Button>
              <Link href="/user/address">
                <Button
                  className="bg-black hover:bg-gray-800 text-white px-8 py-2 w-full sm:w-auto"
                >
                  Proceed to checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CustomPopup
        isOpen={dialog}
        onClose={() => setdialog(false)}
        title="Give a name to your customised Thali!"
        className="sm:max-w-[500px] bg-[#fff5f5] text-black"
        footer={
          <div>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={handleAddToCart}
            >
              Submit
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="thaliName">Thali Name</Label>
          <Input
            id="thaliName"
            placeholder="Enter the name of your Thali"// Assuming setThaliName is a state setter for thali name
            onChange={(e) => setThaliName(e.target.value)}
          />
        </div>

      </CustomPopup>
    </div>
  );
}
