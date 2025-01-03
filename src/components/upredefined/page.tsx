import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { IceCreamBowlIcon as Bowl, CroissantIcon as Bread, IceCream2, UtensilsCrossed } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Link from 'next/link';
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
    <div id="predefined" className="min-h-screen bg-[#FFF5F5] py-8 px-4 sm:py-16">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl text-center font-poorStory mb-8 sm:mb-12 text-[black]">
          Check out our Pre-defined Thalis
        </h1>
        
        <div className="mt-16 sm:mt-32 relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto px-[20px]"
          >
            <CarouselContent className="min-w-[100%] h-auto min-h-[90vh] h-auto">
              {thalis.map((thali, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 h-full">
                  <div className="relative px-4 h-full flex flex-col top-[20px]">
                    <div className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 z-10 w-[220px] h-[220px] md:w-[280px] md:h-[280px] overflow-hidden rounded-full">
                      <Image 
                        src={thali.image}
                        alt={thali.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                    <Card className="bg-[#997864] text-white border-none flex flex-col h-full mt-[80px] md:mt-[130px] pt-[80px] md:pt-[100px]">
                      <CardHeader className="pb-2">
                        <h2 className="text-2xl font-semibold">{thali.title}</h2>
                        <p className="text-sm opacity-90">{thali.subtitle}</p>
                      </CardHeader>
                      <CardContent className="space-y-2 flex-grow">
                        {menuItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            {item.icon}
                            <span className="text-sm">{item.text}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>

        <div className="flex justify-center ">
          <Link href="/user/thali">
          <Button size="lg" className="bg-black text-white hover:bg-black/90">
            Order Predefined Thali
          </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


