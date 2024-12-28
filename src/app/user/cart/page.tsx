import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import FoodCard from "@/components/cartCard/page"
const ThaliMenu = [
    {
      id: 'maharaja-thali',
      title: 'Maharaja Thali',
      items: [
        { name: 'Dal Makhani', price: 70 },
        { name: 'Paneer Tikka', price: 200 },
        { name: 'Jeera Rice', price: 150 },
        { name: 'Naan', price: 70 },
      ]
    },
    {
      id: 'punjai-thali',
      title: 'Punjabi Thali',
      items: [
        { name: 'Chole', price: 80 },
        { name: 'Paneer Butter Masala', price: 180 },
        { name: 'Pulao', price: 140 },
        { name: 'Roti', price: 50 },
      ]
    },
    // Add more thali options as needed
  ]


export default function Cart()
{
    return(
        <>
        <div className="mt-[70px] w-[100%] min-h-[100vh] h-auto pb-[6%]">
        <Button variant="default" className="bg-black hover:text-[black] m-[30px]">
          <ChevronLeft /> Back
        </Button>
           <h1 className="text-[black]  py-[10px] text-4xl font-poorStory font-bold text-center">Your Cart</h1>
           <div className="w-auto min-h-[100vh] h-auto flex flex-row flex-wrap"> 
             {
                ThaliMenu.map((item) => (
                  <FoodCard key={item.id} heading={item.title} items={item.items} />
                ))
             }
           </div>

           <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="border-2 border-black rounded-md px-6 py-2">
              <span className="font-bold text-[black]">Order Total: ₹ 1000</span>
            </div>
            <div className="flex gap-4">
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
    )
}