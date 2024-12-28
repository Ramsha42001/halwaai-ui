'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Minus, Plus } from 'lucide-react'

interface MenuItemCardProps {
  title: string
  description: string
  imageUrl: string
}

export default function MenuItemCard({ 
  title = "Tandoori Roti",
  description = "Soft, fluffy roti, hand-tossed and baked in a hot tandoor.",
  imageUrl = "/placeholder.svg?height=200&width=300"
}: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [butterEnabled, setButterEnabled] = useState(false)

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  return (
    <Card className="w-[320px] h-[370px] overflow-hidden bg-[#8B7355] z-[0]">
      <CardContent className="p-0">
        <div className="relative">
          {/* Image Container */}
          <div className="relative h-[230px] w-full p-2">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
            {/* Butter Toggle */}
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-black/50 p-2 text-white backdrop-blur-sm">
              <span className="text-sm font-medium">Butter</span>
              <div className="flex gap-1">
                <Toggle
                  pressed={butterEnabled}
                  onPressedChange={() => setButterEnabled(true)}
                  className="h-6 w-8 bg-green-600 data-[state=on]:bg-green-600"
                >
                  Yes
                </Toggle>
                <Toggle
                  pressed={!butterEnabled}
                  onPressedChange={() => setButterEnabled(false)}
                  className="h-6 w-8 bg-red-600 data-[state=on]:bg-red-600"
                >
                  No
                </Toggle>
              </div>
            </div>
            {/* Quantity Counter */}
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/50 p-2 text-white backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/20"
                onClick={decrementQuantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-4 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-white/20"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Title and Description */}
          <div className="p-4 text-white">
            <h3 className="font-['Comic_Sans_MS'] text-2xl">{title}</h3>
            <p className="mt-1 text-sm text-gray-200">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

