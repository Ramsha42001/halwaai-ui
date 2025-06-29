'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MoreVertical, Download, Phone, Menu, Clock, CheckCircle, XCircle, Package } from 'lucide-react'
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

import { ref, onValue, update, off } from 'firebase/database'
import { database } from '@/lib/firebase'
import withAuth, { withAdminAuth } from '@/utils/withAuth'

interface OrderItem {
  _id: string
  name: string
  quantity: number
  price: number
  includedItems?: string[]
}

interface CustomerDetails {
  name: string
  phone: string
  email: string
  address: {
    firstName: string
    lastName: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    zipCode: string
  }
}

interface Order {
  id: string
  customerId: string
  customer: CustomerDetails
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  status: 'pending' | 'approved' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  createdAt: string
  updatedAt: string
  deliverySchedule?: {
    selectedDate: string
    selectedTime: string
    deliveryType: 'standard' | 'express'
  }
}

function AdminOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    // Subscribe to orders from Firebase
    const ordersRef = ref(database, 'orders')

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const ordersList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }))
        // Sort by creation date (newest first)
        ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setOrders(ordersList)
      } else {
        setOrders([])
      }
      setLoading(false)
    })

    return () => {
      off(ordersRef, 'value', unsubscribe)
    }
  }, [])

  const updateOrderStatus = async (orderId: string, newStatus: Order['status'], confirmMessage?: string) => {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return
    }

    setUpdating(orderId)
    try {
      const orderRef = ref(database, `orders/${orderId}`)
      await update(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })

      // Also update in user's inventory if needed
      const order = orders.find(o => o.id === orderId)
      if (order) {
        const userOrderRef = ref(database, `inventories/${order.customerId}/orderStatus`)
        await update(userOrderRef, { status: newStatus })
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status. Please try again.')
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500'
      case 'approved':
        return 'bg-blue-500'
      case 'preparing':
        return 'bg-purple-500'
      case 'ready':
        return 'bg-green-500'
      case 'delivered':
        return 'bg-gray-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />
      case 'approved':
        return <CheckCircle className="h-3 w-3" />
      case 'preparing':
        return <Package className="h-3 w-3" />
      case 'ready':
        return <CheckCircle className="h-3 w-3" />
      case 'delivered':
        return <CheckCircle className="h-3 w-3" />
      case 'cancelled':
        return <XCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery)

    const matchesTab = activeTab === 'all' || order.status === activeTab

    return matchesSearch && matchesTab
  })

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl pb-[40%] sm:pb-[30%] lg:pb-[20px]">
      <div className="fixed top-[70px] left-0 right-0 flex items-center justify-between p-4 mb-6 bg-white border-b text-[black] z-30">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl md:text-2xl font-semibold">Order Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search orders..."
            className="max-w-[120px] md:max-w-xs hidden md:block"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Sheet>
            <SheetTitle className="text-transparent">
              Filter Orders
            </SheetTitle>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[200px] sm:w-[300px]">
              <div className="flex flex-col gap-4 mt-6">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('all')}
                  className="w-full justify-start"
                >
                  All Orders
                </Button>
                <Button
                  variant={activeTab === 'pending' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('pending')}
                  className="w-full justify-start"
                >
                  Pending
                </Button>
                <Button
                  variant={activeTab === 'approved' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('approved')}
                  className="w-full justify-start"
                >
                  Approved
                </Button>
                <Button
                  variant={activeTab === 'preparing' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('preparing')}
                  className="w-full justify-start"
                >
                  Preparing
                </Button>
                <Button
                  variant={activeTab === 'ready' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('ready')}
                  className="w-full justify-start"
                >
                  Ready
                </Button>
                <Button
                  variant={activeTab === 'delivered' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('delivered')}
                  className="w-full justify-start"
                >
                  Delivered
                </Button>
                <Button
                  variant={activeTab === 'cancelled' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('cancelled')}
                  className="w-full justify-start"
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
          <TabsList className="grid w-full grid-cols-7 bg-[black]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="preparing">Preparing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">#{order.id}</span>
                      <Badge className={`${getStatusColor(order.status)} text-white flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={updating === order.id}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {order.status === 'pending' && (
                        <>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'approved')}>
                            Approve Order
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'cancelled', 'Are you sure you want to cancel this order?')}>
                            Cancel Order
                          </DropdownMenuItem>
                        </>
                      )}
                      {order.status === 'approved' && (
                        <>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'preparing')}>
                            Start Preparing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'cancelled', 'Are you sure you want to cancel this order?')}>
                            Cancel Order
                          </DropdownMenuItem>
                        </>
                      )}
                      {order.status === 'preparing' && (
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'ready')}>
                          Mark as Ready
                        </DropdownMenuItem>
                      )}
                      {order.status === 'ready' && (
                        <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'delivered')}>
                          Mark as Delivered
                        </DropdownMenuItem>
                      )}
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
                          <div className="text-sm">
                            <p>{order.customer.address.firstName} {order.customer.address.lastName}</p>
                            <p>{order.customer.address.addressLine1}</p>
                            {order.customer.address.addressLine2 && <p>{order.customer.address.addressLine2}</p>}
                            <p>{order.customer.address.city}, {order.customer.address.state} {order.customer.address.zipCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.deliverySchedule && (
                      <div>
                        <h3 className="font-semibold mb-2">Delivery Schedule</h3>
                        <div className="text-sm">
                          <p>Date: {order.deliverySchedule.selectedDate}</p>
                          <p>Time: {order.deliverySchedule.selectedTime}</p>
                          <p>Type: {order.deliverySchedule.deliveryType}</p>
                        </div>
                      </div>
                    )}

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
                        <div key={item._id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg mb-2">
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
                            {item.includedItems && item.includedItems.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Items Included:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                  {item.includedItems.map((includedItem, index) => (
                                    <p key={index}>{includedItem}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                      {order.status === 'pending' && (
                        <>
                          <Button
                            variant="destructive"
                            className="w-full sm:w-auto"
                            disabled={updating === order.id}
                            onClick={() => updateOrderStatus(order.id, 'cancelled', 'Are you sure you want to cancel this order?')}
                          >
                            {updating === order.id ? 'Updating...' : 'Cancel Order'}
                          </Button>
                          <Button
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateOrderStatus(order.id, 'approved')}
                            disabled={updating === order.id}
                          >
                            {updating === order.id ? 'Updating...' : 'Approve Order'}
                          </Button>
                        </>
                      )}

                      {order.status === 'approved' && (
                        <Button
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          disabled={updating === order.id}
                        >
                          {updating === order.id ? 'Updating...' : 'Start Preparing'}
                        </Button>
                      )}

                      {order.status === 'preparing' && (
                        <Button
                          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          disabled={updating === order.id}
                        >
                          {updating === order.id ? 'Updating...' : 'Mark as Ready'}
                        </Button>
                      )}

                      {order.status === 'ready' && (
                        <Button
                          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          disabled={updating === order.id}
                        >
                          {updating === order.id ? 'Updating...' : 'Mark as Delivered'}
                        </Button>
                      )}

                      <Button className="w-full sm:w-auto text-[black] border-[2px]">
                        <Download className="h-4 w-4 mr-2 text-[black]" />
                        Download Invoice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default withAdminAuth(AdminOrderHistory)