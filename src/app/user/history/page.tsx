'use client'

import { useState } from 'react'
import { ArrowLeft, MoreVertical, Download, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { orders } from '@/app/data/orders'

export default function History() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="container mx-auto p-4 max-w-3xl mt-[70px]">
      <div className="fixed top-[10%] left-0 right-0 flex items-center justify-between p-4 mb-6 bg-white border-b text-[black]">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Order History</h1>
        </div>
        <Input
          type="search"
          placeholder="Search Orders..."
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="mb-6 mt-[10%] bg-[black] rounded-sm">
        <TabsList className="grid w-full grid-cols-4 bg-[black] text-[white]">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">#{order.id}</span>
                  <Badge variant={order.status === 'pending' ? 'secondary' : 'default'} className="bg-[black] text-[white]">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on {order.date} at {order.time}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Contact Owner</DropdownMenuItem>
                  <DropdownMenuItem>Download Invoice</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Customer Details</h3>
                      <div className="space-y-1 text-sm">
                        <p>{order.customer.name}</p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.customer.phone}
                        </p>
                        <p className="text-muted-foreground">{order.customer.email}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Delivery Address</h3>
                      <p className="text-sm">{order.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>₹{order.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <img
                        src="/images/thali1.png"
                        alt={item.name}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <span className="font-semibold">₹{item.price}</span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Items Included:</p>
                          <div className="grid grid-cols-2 gap-x-4 text-sm text-muted-foreground">
                            {item.includedItems.map((includedItem, index) => (
                              <p key={index}>{includedItem}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="destructive">Cancel Order</Button>
                  <Button className="text-[black] border-[2px]">
                    <Download className="h-4 w-4 mr-2 text-[black]" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

