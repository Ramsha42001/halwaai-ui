'use client'

import { useState,useEffect } from 'react'
import { ArrowLeft, MoreVertical, Download, Phone, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { orders } from '@/app/data/orders'
import Link from 'next/link'
import {orderHistoryService} from '@/services/api/orderHistoryService';

interface OrderHistory {
  orderId: string;
  orderDate: string;
  menuItems: Map<string, any>;
  deliveryAddress: {
    street: string;
    city: string;
    zip: string;
  };
  customerDetails: {
    name: string;
    phoneNumber: string;
    email: string;
  };
  status: string;
  totalPrice: number;
}

export default function History() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          console.error('No user ID found')
          return
        }

        const response = await orderHistoryService.getOrderHistoryUser(userId)
        console.log('response:',response)
        if (response) {
          setOrderHistory(response)
        }
      } catch (error) {
        console.error('Error fetching order history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderHistory()
  }, []) 

  return (
    <div className="container mx-auto p-4 max-w-3xl mt-[70px] pb-[40%] sm:pb-[30%] lg:pb-[20px]">
      <div className="fixed top-[70px] left-0 right-0 flex items-center justify-between p-4 mb-6 bg-white border-b text-[black] z-30">
        <div className="flex items-center gap-4">
          <Link href="/user/address">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-semibold">Order History</h1>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search..."
            className="max-w-[120px] md:max-w-xs hidden md:block"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Sheet>
            <SheetTitle className="text-transparent">
              Category
            </SheetTitle>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5 " />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[200px] sm:w-[300px]">
              <div className="flex flex-col gap-4 mt-6">
                <Button 
                  variant={activeTab === 'all' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('all')}
                  className="w-full justify-start bg-opacity-40"
                >
                  All Orders
                </Button>
                <Button 
                  variant={activeTab === 'active' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('active')}
                  className="w-full justify-start bg-opacity-40"
                >
                  Active
                </Button>
                <Button 
                  variant={activeTab === 'completed' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('completed')}
                  className="w-full justify-start bg-opacity-40"
                >
                  Completed
                </Button>
                <Button 
                  variant={activeTab === 'cancelled' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('cancelled')}
                  className="w-full justify-start bg-opacity-40"
                >
                  Cancelled
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="mt-[80px] md:mt-[100px]">
        <Input
          type="search"
          placeholder="Search Orders..."
          className="mb-4 md:hidden"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 bg-[black] rounded-sm hidden md:block">
          <TabsList className="grid w-full grid-cols-4 bg-[black] ">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-4">
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
              <CardContent className="p-4">
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                        <img
                          src="/images/thali1.png"
                          alt={item.name}
                          className="w-full sm:w-20 h-40 sm:h-20 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              {item.includedItems.map((includedItem, index) => (
                                <p key={index}>{includedItem}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Button variant="destructive" className="w-full sm:w-auto">Cancel Order</Button>
                    <Button className="w-full sm:w-auto text-[black] border-[2px]">
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
    </div>
  )
}

