'use client'

import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Define types for props
interface Item {
  name: string
  price: number
}

interface FoodCardProps {
  heading: string
  items: Item[]
}

export default function FoodCard({ heading, items }: FoodCardProps) {
  const [quantity, setQuantity] = useState<number>(1)

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

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
          <span className="text-xl min-w-[1.5rem] text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={increaseQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" className="h-8 w-8 ml-2">
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
              <span>₹ {item.price}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <div >
            <img src="/images/thali1.png" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
