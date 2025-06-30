'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, Package, Truck, Clock, XCircle, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ref, onValue, off } from 'firebase/database'
import { database } from '@/lib/firebase'
import withAuth from '@/utils/withAuth'

interface OrderItem {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    includedItems?: string[];
    type: 'custom' | 'special';
    thaliPrice: number;
    cartQuantity: number;
}

interface Address {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

interface DeliverySchedule {
    selectedDate: string;
    selectedTime: string;
    deliveryType: 'standard' | 'express';
    dateLabel?: string;
    timeLabel?: string;
}

interface Order {
    id?: string;
    customerId: string;
    customer: {
        name: string;
        phone: string;
        email: string;
        address: Address;
    };
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: 'pending' | 'approved' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    deliverySchedule?: DeliverySchedule;
}

function OrderSummary() {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')

    const userId = localStorage.getItem('authToken')

    useEffect(() => {
        if (!userId) {
            setError('User not authenticated')
            setLoading(false)
            return
        }

        // Subscribe to all orders from Firebase
        const ordersRef = ref(database, 'orders')

        const unsubscribe = onValue(ordersRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                // Filter orders for the current user
                const userOrders = Object.entries(data)
                    .map(([key, value]: [string, any]) => ({
                        id: key,
                        ...value,
                    }))
                    .filter((order: Order) => order.customerId === userId)
                    .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

                setOrders(userOrders)
                setError(null)
            } else {
                setOrders([])
            }
            setLoading(false)
        }, (error) => {
            console.error('Error fetching orders:', error)
            setError('Failed to fetch orders')
            setLoading(false)
        })

        // Cleanup subscription
        return () => {
            off(ordersRef, 'value')
        }
    }, [userId])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-5 w-5" />
            case 'approved':
                return <CheckCircle className="h-5 w-5" />
            case 'preparing':
                return <Package className="h-5 w-5" />
            case 'ready':
            case 'delivered':
                return <Truck className="h-5 w-5" />
            case 'cancelled':
                return <XCircle className="h-5 w-5" />
            default:
                return <Clock className="h-5 w-5" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300'
            case 'approved':
                return 'bg-blue-100 text-blue-800 border-blue-300'
            case 'preparing':
                return 'bg-purple-100 text-purple-800 border-purple-300'
            case 'ready':
                return 'bg-green-100 text-green-800 border-green-300'
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-300'
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-300'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300'
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order)
        setViewMode('detail')
    }

    const handleBackToList = () => {
        setSelectedOrder(null)
        setViewMode('list')
    }

    if (loading) {
        return (
            <div className="container mx-auto p-4 max-w-3xl mt-[70px]">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading orders...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-4 max-w-3xl mt-[70px]">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Error Loading Orders</h2>
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Link href="/user">
                            <Button>Go to Menu</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Detail view for a specific order
    if (viewMode === 'detail' && selectedOrder) {
        return (
            <div className="container mx-auto p-4 max-w-3xl mt-[70px] pb-[40%] sm:pb-[30%] lg:pb-[20px]">
                {/* Header */}
                <div className="fixed top-[70px] left-0 right-0 flex items-center justify-between p-4 mb-6 bg-white border-b z-30">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBackToList}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl md:text-2xl font-semibold">Order Details</h1>
                    </div>
                </div>

                <div className="mt-[80px] md:mt-[100px] space-y-6">
                    {/* Order Status */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Order Status</h3>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusIcon(selectedOrder.status)}
                                    <span className="font-medium capitalize">{selectedOrder.status}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Order ID:</span>
                                    <span className="font-medium">#{selectedOrder.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Order Date:</span>
                                    <span>{formatDate(selectedOrder.createdAt)}</span>
                                </div>
                                {selectedOrder.deliverySchedule && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery Schedule:</span>
                                        <span>
                                            {selectedOrder.deliverySchedule.dateLabel} at {selectedOrder.deliverySchedule.timeLabel}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold">Customer Details</h3>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p className="font-medium">{selectedOrder.customer.name}</p>
                                <p className="text-muted-foreground">{selectedOrder.customer.phone}</p>
                                <p className="text-muted-foreground">{selectedOrder.customer.email}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <h3 className="font-semibold">Delivery Address</h3>
                            </CardHeader>
                            <CardContent className="space-y-1 text-sm">
                                <p>{selectedOrder.customer.address.addressLine1}</p>
                                {selectedOrder.customer.address.addressLine2 && (
                                    <p>{selectedOrder.customer.address.addressLine2}</p>
                                )}
                                <p>
                                    {selectedOrder.customer.address.city}, {selectedOrder.customer.address.state} {selectedOrder.customer.address.zipCode}
                                </p>
                                <p>{selectedOrder.customer.address.country}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <h3 className="font-semibold">Order Items ({selectedOrder.items.length})</h3>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {selectedOrder.items.map((item, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">{item.name}</h4>
                                                <Badge variant={item.type === 'custom' ? 'default' : 'secondary'}>
                                                    {item.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Quantity: {item.cartQuantity} × ₹{item.thaliPrice}
                                            </p>
                                            {item.includedItems && item.includedItems.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-sm font-medium">Includes:</p>
                                                    <div className="grid grid-cols-2 gap-1 mt-1">
                                                        {item.includedItems.map((includedItem, idx) => (
                                                            <p key={idx} className="text-sm text-muted-foreground">
                                                                • {includedItem}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-semibold">₹{item.thaliPrice * item.cartQuantity}</span>
                                    </div>
                                    {index < selectedOrder.items.length - 1 && <Separator />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <h3 className="font-semibold">Payment Summary</h3>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{selectedOrder.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Delivery Fee</span>
                                    <span>{selectedOrder.deliveryFee > 0 ? `₹${selectedOrder.deliveryFee}` : 'FREE'}</span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total Amount</span>
                                <span>₹{selectedOrder.total}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="w-full" onClick={handleBackToList}>
                            Back to Orders
                        </Button>
                        <Link href="/" className="flex-1">
                            <Button className="w-full bg-black text-white">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // List view for all orders
    return (
        <div className="container mx-auto p-4 max-w-3xl mt-[70px] pb-[40%] sm:pb-[30%] lg:pb-[20px]">
            {/* Header */}
            <div className="fixed top-[70px] left-0 right-0 flex items-center justify-between p-4 mb-6 bg-white border-b z-30">
                <div className="flex items-center gap-4">
                    <Link href="/user/orderSummary">
                        <Button variant="ghost" size="icon" style={{ color: 'black' }}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-xl md:text-2xl font-semibold text-[black]">My Orders</h1>
                </div>
            </div>

            <div className="mt-[80px] md:mt-[100px] space-y-6">
                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Package className="h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                You haven't placed any orders yet. Start shopping to see your order history here.
                            </p>
                            <Link href="/">
                                <Button className="bg-black text-white">
                                    Start Shopping
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleOrderClick(order)}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="font-medium capitalize text-sm">{order.status}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">#{order.id}</span>
                                        </div>
                                        <Eye className="h-5 w-5 text-muted-foreground" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Order Date</span>
                                            <span className="text-sm">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Items</span>
                                            <span className="text-sm">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Total Amount</span>
                                            <span className="font-semibold">₹{order.total}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/" className="flex-1">
                        <Button className="w-full bg-black text-white">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default withAuth(OrderSummary)