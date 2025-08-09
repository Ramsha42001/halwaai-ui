'use client'

import { useState, useEffect } from 'react'
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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { orderHistoryService } from '@/services/api/orderHistoryService';
import { useStore } from '@/services/store/menuItemsStore'
import withAuth from '@/utils/withAuth'

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

function History() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)

  const {
    subscribe,
    unsubscribe,
    cart,
    orderTotal,
    selectedAddress,
    deliverySchedule,
    orderStatus,
    changeOrderStatus,
    placeOrder,
    clearAllUserData
  } = useStore();

  const user = localStorage.getItem('authToken')

  useEffect(() => {
    if (user) {
      subscribe(user);
      return () => unsubscribe();
    }
  }, [user, subscribe, unsubscribe]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);

        const userId = localStorage.getItem('authToken')
        if (!userId) {
          console.error('No user ID found')
          alert("Authentication Required: Please log in to view your order history.");
          return
        }

        const response = await orderHistoryService.getOrderHistoryUser(userId)
        console.log('response:', response)
        if (response) {
          setOrderHistory(response)
        }
      } catch (error) {
        console.error('Error fetching order history:', error)
        alert("Failed to Load Orders: Unable to fetch your order history. Please refresh the page.");
      } finally {
        setLoading(false)
      }
    }

    fetchOrderHistory()
  }, [])

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      console.log('Starting order placement...');

      // Validate user authentication
      if (!user) {
        alert("Authentication Required: Please log in to place an order.");
        return;
      }

      // Check if cart is empty
      if (!cart || cart.items.length === 0) {
        alert("Empty Cart: Please add items to your cart before placing an order.");
        return;
      }

      // Validate required data
      if (!selectedAddress) {
        alert("Missing Address: Please select a delivery address.");
        console.error('selectedAddress is missing:', selectedAddress);
        return;
      }

      if (!deliverySchedule) {
        alert("Missing Schedule: Please select a delivery schedule.");
        console.error('deliverySchedule is missing:', deliverySchedule);
        return;
      }

      // Log current state for debugging
      console.log('Order data before placement:', {
        user,
        cart: cart?.items,
        selectedAddress,
        deliverySchedule,
        orderTotal,
        orderStatus
      });

      // Show processing message
      console.log('Changing order status to processing...');
      await changeOrderStatus(user, 'processing');

      console.log('Calling placeOrder function...');
      // Place the order - this should save to Firebase
      const orderId = await placeOrder(user);

      console.log('Order placement result:', orderId);

      if (orderId) {
        console.log('Order placed successfully with ID:', orderId);

        // Clear cart after successful order
        console.log('Clearing user data...');
        await clearAllUserData(user);

        // Show success message
        alert(`Order Placed Successfully! Your order #${orderId} has been placed and will be delivered as scheduled.`);

        // Store last order ID
        localStorage.setItem('lastOrderId', orderId);

        // Navigate to order summary
        router.push('/user/orderSummary');

        // Optional: Refresh order history instead of full page reload
        setTimeout(async () => {
          try {
            const updatedResponse = await orderHistoryService.getOrderHistoryUser(user);
            if (updatedResponse) {
              setOrderHistory(updatedResponse);
            }
          } catch (error) {
            console.error('Error refreshing order history:', error);
            // Fallback to page reload if needed
            window.location.reload();
          }
        }, 1000);
      } else {
        console.error('Order placement failed - no order ID returned');
        alert("Order Failed: Failed to place order. Please try again.");
        await changeOrderStatus(user, 'pending');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      alert("Error: An unexpected error occurred. Please try again.");

      // Reset order status on error
      try {
        await changeOrderStatus(user, 'pending');
      } catch (statusError) {
        console.error('Error resetting order status:', statusError);
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleClearCart = async () => {
    try {
      if (!user) {
        alert("Authentication Required: Please log in first.");
        return;
      }

      await clearAllUserData(user);
      alert("Cart Cleared: All items have been removed from your cart.");

      // Refresh to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert("Error: Failed to clear cart. Please try again.");
    }
  };

  const handleContactOwner = (orderId: string) => {
    alert("Contact Support: Redirecting to customer support for assistance...");
    // Add your contact logic here
    console.log('Contacting support for order:', orderId);
  };

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      alert("Preparing Download: Your invoice is being generated...");
      console.log('Downloading invoice for order:', orderId);

      // Add your download logic here
      // await downloadInvoice(orderId);

      // Simulate download delay
      setTimeout(() => {
        alert("Download Complete: Invoice has been downloaded successfully.");
      }, 2000);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert("Download Failed: Unable to download invoice. Please try again.");
    }
  };

  // Helper function to get badge variant based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary'
      case 'active':
      case 'processing':
        return 'default'
      case 'completed':
        return 'outline'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  // Helper function to get badge color classes
  const getStatusBadgeClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-200 text-yellow-800'
      case 'active':
      case 'processing':
        return 'bg-blue-200 text-blue-800'
      case 'completed':
        return 'bg-green-200 text-green-800'
      case 'cancelled':
        return 'bg-red-200 text-red-800'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }

  const filteredOrders = orderHistory.filter(order => {
    const matchesSearch = searchQuery === '' ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerDetails.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === 'all' || order.status.toLowerCase() === activeTab;

    return matchesSearch && matchesTab;
  });

  // Generate a mock order ID for current cart (you can replace this with actual order ID generation)
  const currentOrderId = `ORD-${Date.now()}`;

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-3xl mt-[70px] pb-[40%] sm:pb-[30%] lg:pb-[20px]">
        <div className="fixed top-[70px] left-0 right-0 flex items-center justify-between p-4 mb-6 bg-white border-b text-[black] z-30">
          <div className="flex items-center gap-4">
            <Link href="/user/address">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl md:text-2xl font-semibold">Order Summary</h1>
          </div>
        </div>
        <div className="mt-[100px] flex justify-center">
          <p className="text-muted-foreground">Loading your order summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl mt-[70px] pb-[40%] sm:pb-[30%] lg:pb-[20px]">
      <div className="fixed top-[70px] left-0 right-0 flex items-center justify-between p-4 mb-6 bg-white border-b text-[black] z-30">
        <div className="flex items-center gap-4">
          <Link href="/user/address">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-semibold">Order Summary</h1>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTitle className="text-transparent">
              Category
            </SheetTitle>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5 " />
              </Button>
            </SheetTrigger>
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

        <div className="space-y-4">
          {/* Show current cart as pending order if there are items */}
          {cart && cart.items.length > 0 && (
            <Card className="overflow-hidden border-2 border-yellow-500">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-yellow-50">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">#{currentOrderId}</span>
                    <Badge
                      variant={getStatusBadgeVariant(orderStatus)}
                      className={getStatusBadgeClasses(orderStatus)}
                    >
                      {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {deliverySchedule ?
                      `Delivery by ${deliverySchedule.dateLabel} at ${deliverySchedule.timeLabel}` :
                      'Delivery schedule not set'
                    }
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/user/cart">Edit Cart</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Customer Details</h3>
                      <div className="space-y-1 text-sm">
                        <p>{selectedAddress ? `${selectedAddress.firstName} ${selectedAddress.lastName}` : 'Not set'}</p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {selectedAddress?.phone || 'Not set'}
                        </p>
                        <p className="text-muted-foreground">{selectedAddress?.email || 'Not set'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Delivery Address</h3>
                      {selectedAddress ? (
                        <>
                          <p className="text-sm">{selectedAddress.addressLine1}</p>
                          {selectedAddress.addressLine2 && <p className="text-sm">{selectedAddress.addressLine2}</p>}
                          <p className="text-sm">{`${selectedAddress.city} ${selectedAddress.zipCode}`}</p>
                          <p className="text-sm">{`${selectedAddress.state}, ${selectedAddress.country}`}</p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Address not set</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{orderTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>₹0</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total:</span>
                        <span>₹{orderTotal}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Cart Items ({cart.items.length} Thali{cart.items.length > 1 ? 's' : ''})</h3>
                    {cart.items.map((cartItem, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg mb-4">
                        <img
                          src={cartItem.type === 'special' && (cartItem.thali as any).image ?
                            (cartItem.thali as any).image :
                            "/images/thali1.png"
                          }
                          alt={cartItem.thali.name || 'Custom Thali'}
                          className="w-full sm:w-20 h-40 sm:h-20 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <div>
                              <h4 className="font-semibold">
                                {cartItem.thali.name || 'Custom Thali'}
                                <Badge className="ml-2" variant={cartItem.type === 'custom' ? 'default' : 'secondary'}>
                                  {cartItem.type}
                                </Badge>
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {cartItem.cartQuantity} | Price per thali: ₹{cartItem.thali.thaliPrice}
                              </p>
                            </div>
                            <span className="font-semibold">₹{cartItem.thali.thaliPrice * cartItem.cartQuantity}</span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium">Items Included:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              {/* {cartItem.thali.map((item, itemIndex) => (
                                <p key={itemIndex}>
                                  {item.name} (x{item.quantity})
                                </p>
                              ))} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Link href="/user/cart">
                      <Button variant="outline" className="w-full sm:w-auto" >
                        Edit Cart
                      </Button>
                    </Link>
                    <Button
                      className="w-full sm:w-auto bg-black text-white"
                      onClick={handlePlaceOrder}
                      disabled={placingOrder || !selectedAddress || !deliverySchedule}
                    >
                      {placingOrder ? 'Placing Order...' : 'Place Order'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {filteredOrders.map((order) => (
            <Card key={order.orderId} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">#{order.orderId}</span>
                    <Badge
                      variant={getStatusBadgeVariant(order.status)}
                      className={getStatusBadgeClasses(order.status)}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Order Date: {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleContactOwner(order.orderId)}>
                      Contact Support
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadInvoice(order.orderId)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Customer Details</h3>
                      <div className="space-y-1 text-sm">
                        <p>{order.customerDetails.name}</p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.customerDetails.phoneNumber}
                        </p>
                        <p className="text-muted-foreground">{order.customerDetails.email}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Delivery Address</h3>
                      <p className="text-sm">{order.deliveryAddress.street}</p>
                      <p className="text-sm">{`${order.deliveryAddress.city} ${order.deliveryAddress.zip}`}</p>
                    </div>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>₹{order.totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (!cart || cart.items.length === 0) && !loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchQuery ? 'Try adjusting your search terms' : 'Start shopping to see your orders here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withAuth(History)