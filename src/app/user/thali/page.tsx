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
    <>
      <div className="mt-[70px]">
        <Button variant="default" className="bg-black hover:text-[black] m-[30px]">
          <ChevronLeft />Back
        </Button>
        <h2 className="font-poorStory font-semibold text-3xl text-[black] py-[20px] text-center">
          Selected Items In The Thali
        </h2>
        <div className="w-[100%] min-h-[100vh] h-auto flex flex-row text-[black] px-[20px] justify-end items-start">
          <div className="w-[40%] h-[60vh] flex justify-center items-center">
            <img src="/images/thali1.png" alt="Thali" />
          </div>
          <div className="w-[60%] h-auto flex flex-row flex-wrap gap-4 justify-start items-start">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="p-4 w-[300px] min-h-[120px] h-auto border-[2px] border-[black] rounded-md bg-[white]"
              >
                <div className="flex flex-row w-full justify-between">
                  <h5 className="font-bold text-1xl">{item.name}</h5>
                  <h5 className="font-bold text-1xl">₹{item.price}</h5>
                </div>
                <p className="font-medium text-1xl">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total and Action Buttons */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="border-2 border-black rounded-md px-6 py-2">
              <span className="font-bold text-[black]">Order Total: ₹{orderTotal}</span>
            </div>
            <div className="flex gap-4">
              <Button 
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-2"
              >
                Add to Cart
              </Button>
              <Button 
                className="bg-black hover:bg-gray-800 text-white px-8 py-2"
              >
                Proceed to checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

