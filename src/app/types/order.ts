export interface OrderItem {
    id: string
    name: string
    quantity: number
    price: number
    image: string
    includedItems: string[]
  }
  
  export interface Order {
    id: string
    status: 'pending' | 'completed' | 'cancelled'
    date: string
    time: string
    customer: {
      name: string
      phone: string
      email: string
    }
    deliveryAddress: string
    deliveryFee: number
    subtotal: number
    total: number
    items: OrderItem[]
  }
  
  