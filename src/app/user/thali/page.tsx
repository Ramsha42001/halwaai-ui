'use client'

import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';

const menuItems = [
  {
    id: 1,
    name: "Dal Makhani",
    price: 250,
    description: "Rich and creamy black lentils cooked to perfection.",
  },
  {
    id: 2,
    name: "Paneer Butter Masala",
    price: 300,
    description: "Cottage cheese cooked in a creamy tomato gravy.",
  },
  {
    id: 3,
    name: "Butter Naan",
    price: 50,
    description: "Soft Indian bread topped with butter.",
  },
  {
    id: 4,
    name: "Gulab Jamun",
    price: 100,
    description: "Delicious Indian sweet made of milk solids.",
  },
  {
    id: 5,
    name: "Gulab Jamun",
    price: 100,
    description: "Delicious Indian sweet made of milk solids.",
  },
  {
    id: 6,
    name: "Gulab Jamun",
    price: 100,
    description: "Delicious Indian sweet made of milk solids.",
  },
  {
    id: 7,
    name: "Gulab Jamun",
    price: 100,
    description: "Delicious Indian sweet made of milk solids.",
  },
];

export default function Thali() {
  // Calculate total order amount
  const orderTotal = menuItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="flex flex-col min-h-screen mt-[70px] text-[black] pb-[40%] sm:pb-[40%] lg:pb-[5%]">
      <div className="container mx-auto px-4">
        <Button variant="default" className="bg-black hover:text-[black] my-4">
          <ChevronLeft className="mr-2" />Back
        </Button>
        
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
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-[2px] border-[black] rounded-md bg-[white] h-auto"
                >
                  <div className="flex flex-row w-full justify-between items-start">
                    <h5 className="font-bold text-lg">{item.name}</h5>
                    <h5 className="font-bold text-lg">₹{item.price}</h5>
                  </div>
                  <p className="font-medium text-sm mt-2 text-gray-600">{item.description}</p>
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
              >
                Add to Cart
              </Button>
              <Button 
                className="bg-black hover:bg-gray-800 text-white px-8 py-2 w-full sm:w-auto"
              >
                Proceed to checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

