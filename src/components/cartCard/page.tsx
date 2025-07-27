import { useState, useEffect } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/services/store/menuItemsStore';
import { cartService } from "@/services/api/cartService"

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface FoodCardProps {
  heading: string;
  id: string;
  thaliquantity: number;
  items: Item[];
  updateCartQuantity: (cartIndex: number, newQuantity: number) => void;
  removeFromCart: (cartIndex: number) => void;
}

export default function FoodCard({ heading, items, id, thaliquantity, updateCartQuantity, removeFromCart }: FoodCardProps) {
  // Remove local quantity state, use thaliquantity from props

  const calculateTotalPrice = () => {
    const total = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return total;
  };

  useEffect(() => {
    const total = calculateTotalPrice();
  }, [items]); // Recalculate when items change

  const increaseQuantity = () => {
    updateCartQuantity(Number(id.split('-')[1]), thaliquantity + 1);
  };

  const decreaseQuantity = () => {
    if (thaliquantity > 1) {
      updateCartQuantity(Number(id.split('-')[1]), thaliquantity - 1);
    }
  };

  const handleRemove = () => {
    removeFromCart(Number(id.split('-')[1]));
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white rounded-3xl mb-6 font-poppins">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <h2 className="text-2xl font-bold">{heading}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={decreaseQuantity}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-xl min-w-[1.5rem] text-center">{thaliquantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={increaseQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" className="h-8 w-8 ml-2" onClick={handleRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 mb-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-gray-600"
            >
              <span>{item.name}</span>
              <span>{item.quantity} x ₹{item.price}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
          <span className="font-semibold">Total Price:</span>
          <span className="font-bold text-lg">₹{calculateTotalPrice()}</span>
        </div>
        <div className="flex justify-center">
          <div>
            <img src="/images/thali1.png" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}