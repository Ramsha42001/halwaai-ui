'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus } from 'lucide-react'
import { useState } from "react"
import { YesNoToggle } from "../toggle/page"
interface MenuItemProps {
  id: number
  name: string
  description: string
  image: string
  quantity: number
  hasButter: boolean
  onQuantityChange: (id: number, increment: boolean) => void
  onButterToggle: (id: number) => void
}

export function MenuItemCard({
  id,
  name,
  description,
  image,
  quantity,
  hasButter,
  onQuantityChange,
  onButterToggle,
}: MenuItemProps) {

  const [isToggled, setIsToggled] = useState(false)
  return (
    <>
    <Card className="bg-[#997864] border-[1px] border-[black] w-full md:w-[350px]">
      <CardContent className="p-4">
        <div className="relative">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover rounded-lg"
          />
           <div className="absolute top-2 left-2 bg-[white] bg-opacity-50 p-3 rounded-xl shadow-md flex items-center space-x-2">
            <h5>Butter</h5>
           <YesNoToggle onToggle={(pressed) => setIsToggled(pressed)} />
    </div>
          <div className="absolute top-2 right-2 bg-white bg-opacity-60 rounded-lg p-1 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onQuantityChange(id, false)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-4 text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onQuantityChange(id, true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-medium text-xl text-white font-poorStory">{name}</h3>
          <p className="text-white/90 text-sm font-poppins">{description}</p>
        </div>
      </CardContent>
    </Card>
    </>
  )
}

