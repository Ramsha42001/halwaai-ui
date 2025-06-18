'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useStore } from '@/services/store/menuItemsStore'
import { orderHistoryService } from "@/services/api/orderHistoryService"

interface Address {
    userId: string; 
    addressLine1: string;
    addressLine2?: string; // Address Line 2 is optional
    city: string;
    state: string;
    country: string;
    zipCode: string;
    _id?: string;// MongoDB ObjectId - optional when creating, present after retrieval from DB
    createdAt?: Date;
    updatedAt?: Date;
  }
interface order {
    orderId: string;
    menuItems: {
        [category: string]: string; // Assuming Types.ObjectId is represented as a string in the UI
    };
    orderDate: Date;
    deliveryAddress: Address;
}

export default function Payment() {
    const { orderTotal } = useStore(); 

    const createOrder = async () => {
        const payload = {
            menuItems: {
                "Appetizers": localStorage.getItem('selectedItem'), // Sample menu item ID
                "Vegetarian": "67a341f4dc4ddae4885f3efb"  // Sample menu item ID
            },
            orderDate: new Date(),
            deliveryAddress: {
                addressLine1: "123 Main Street",
                addressLine2: "Apt 4B",
                city: "New York",
                state: "NY",
                country: "USA",
                zipCode: "10001"
            },
            customerDetails: {
                name: "John Doe",
                phoneNumber: "+1234567890",
                email: "john.doe@example.com"
            },
            status: "pending",
            totalPrice: orderTotal // Using the orderTotal from the store
        }

        const response = await orderHistoryService.createNewOrder(payload);
        console.log(response)
    }
    


    return (
        <div className="min-h-screen bg-[#FFF5F5] text-black px-4 py-20 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/user/address">
                    <Button variant="default" className="bg-black hover:text-black mb-6 md:mb-8">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Address
                    </Button>
                </Link>
                
                <h1 className="font-poorStory font-semibold text-2xl md:text-3xl text-center mb-8">
                    Select Payment Method
                </h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <div className="space-y-6">
                        {/* Payment options */}
                        <div className="flex items-start space-x-3">
                            <input 
                                type="radio" 
                                id="payOnDelivery" 
                                name="paymentMethod" 
                                checked 
                                className="mt-1 h-4 w-4 accent-black"
                            />
                            <div>
                                <label htmlFor="payOnDelivery" className="font-medium text-lg block">
                                    Pay on Delivery
                                </label>
                                <p className="text-gray-600 text-sm mt-1">
                                    Pay with cash when your order is delivered
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 opacity-50">
                            <input 
                                type="radio" 
                                id="onlinePayment" 
                                name="paymentMethod" 
                                disabled
                                className="mt-1 h-4 w-4"
                            />
                            <div>
                                <label htmlFor="onlinePayment" className="font-medium text-lg block">
                                    Online Payment (Coming Soon)
                                </label>
                                <p className="text-gray-600 text-sm mt-1">
                                    Pay securely with credit/debit card or UPI
                                </p>
                            </div>
                        </div>
                        
                        {/* Order summary */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{orderTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-medium">₹40</span>
                                </div>
                                <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span>₹{Number(orderTotal) + 40}</span>
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="button"
                            className="w-full bg-black hover:bg-gray-800 text-white h-12 md:h-14 mt-6"
                            onClick={() => {
                                window.location.href = "/user/history";
                                createOrder()
                            }}
                        >
                            Place Order
                        </Button>
                      
                        
                        <p className="text-xs text-center text-gray-500 mt-4">
                            By placing your order, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}


