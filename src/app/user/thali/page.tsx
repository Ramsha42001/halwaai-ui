'use client'

import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { menuItemService } from '@/services/api/menuItemService';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/services/store/menuItemsStore'
import { CustomPopup } from "@/components/popup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import withAuth from "@/utils/withAuth";
import { useRouter } from 'next/navigation';

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

function Thali() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedItemIds = searchParams.get('items')?.split(',') || [];
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dialog, setdialog] = useState(false);
  const [thaliName, setThaliName] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { selectedItems, subscribe, unsubscribe, orderTotal, addCustomThaliToCart, clearSelectedItems } = useStore();
  const user = localStorage.getItem('authToken')

  useEffect(() => {
    if (user) {
      subscribe(user);
      return () => unsubscribe();
    }
  }, [user, subscribe, unsubscribe]);

  const handleOpenThaliNameDialog = async () => {
    setdialog(!dialog);
  }

  useEffect(() => {
    menuItemService.getMenuItems().then((response) => {
      setMenuItems(response)
    })
  }, [])

  const handleAddToCart = async () => {
    if (!thaliName.trim()) {
      alert('Please enter a name for your thali');
      return;
    }

    setIsAddingToCart(true);
    try {
      const userId = localStorage.getItem('authToken');

      // Add custom thali to cart using the store function
      await addCustomThaliToCart(userId, thaliName);

      // Clear selected items after adding to cart
      await clearSelectedItems(userId);

      // Close dialog
      setdialog(false);

      // Show success message or redirect
      alert('Thali added to cart successfully!');

      // Optionally redirect to cart page
      // router.push('/user/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add thali to cart');
    } finally {
      setIsAddingToCart(false);
    }
  }

  // Filter selected menu items based on store state
  const filteredSelectedMenuItems = selectedItems.map(item => ({
    ...item,
    butter: item.hasButter,
  }));

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
                  {item.butter ? <p className="font-medium text-sm mt-2 text-gray-600">With Butter</p> : null}
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
              {selectedItems.length !== 0 ? <><Button
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2 w-full sm:w-auto"
                onClick={handleOpenThaliNameDialog}
              >
                Add to Cart
              </Button></> : <><Link href='/user/cart'><Button
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2 w-full sm:w-auto"
              >
                Go to Cart
              </Button></Link></>}
              {/* <Link href="/user/address">
                <Button
                  className="bg-black hover:bg-gray-800 text-white px-8 py-2 w-full sm:w-auto"
                  disabled={selectedItems.length === 0}
                >
                  Proceed to checkout
                </Button>
              </Link> */}
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
              disabled={isAddingToCart || !thaliName.trim()}
            >
              {isAddingToCart ? 'Adding...' : 'Submit'}
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="thaliName">Thali Name</Label>
          <Input
            id="thaliName"
            placeholder="Enter the name of your Thali"
            value={thaliName}
            onChange={(e) => setThaliName(e.target.value)}
          />
        </div>
      </CustomPopup>
    </div>
  );
}

export default withAuth(Thali)