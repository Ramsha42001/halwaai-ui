import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { IceCreamBowlIcon as Bowl, CroissantIcon as Bread, IceCream2, UtensilsCrossed } from 'lucide-react'

const thalis = [
  {
    title: "Maharaja Thali",
    subtitle: "A royal feast fit for kings and queens",
    image: "/images/thali1.png",
  },
  {
    title: "Gujarati Thali",
    subtitle: "Experience the flavors of Gujarat",
    image: "/images/thali3.png",
  },
  {
    title: "Deluxe Thali",
    subtitle: "A royal feast fit for kings and queens",
    image: "/images/thali3.png",
  },
]

const menuItems = [
  {
    icon: <Bowl className="w-5 h-5" />,
    text: "6 Vegetarian Dishes",
  },
  {
    icon: <Bread className="w-5 h-5" />,
    text: "3 Types of Bread",
  },
  {
    icon: <IceCream2 className="w-5 h-5" />,
    text: "Dessert",
  },
  {
    icon: <UtensilsCrossed className="w-5 h-5" />,
    text: "Raita",
  },
]

export default function PredefinedThali() {
  return (
    <div className="min-h-screen bg-[#FFF5F5] py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl text-center font-poorStory mb-12">
          Check out our Pre-defined Thalis
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto pt-[10%]">
          {thalis.map((thali, index) => (
            <div key={index} className="relative">
              {/* Image positioned over the card */}
              <img 
                className="absolute top-[-150px] left-1/2 transform -translate-x-1/2 z-10 w-[320px] h-[320px] object-cover rounded-full" 
                src={thali.image} 
                alt={thali.title} 
              />
              <Card className="bg-[#997864] text-white border-none relative pt-40">
                <CardHeader className="pb-2">
                  <h2 className="text-2xl font-semibold">{thali.title}</h2>
                  <p className="text-sm opacity-90">{thali.subtitle}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {menuItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm">{item.text}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button size="lg" className="bg-black text-white hover:bg-black/90">
            Order Predefined Thali
          </Button>
        </div>
      </div>
    </div>
  )
}
