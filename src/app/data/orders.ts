import { Order } from '@/app/types/order'

export const orders: Order[] = [
  {
    id: 'ORD-2023-1234',
    status: 'pending',
    date: 'Dec 15, 2023',
    time: '7:30 PM',
    customer: {
      name: 'John Doe',
      phone: '+91-9555369500',
      email: 'johndoe@example.com'
    },
    deliveryAddress: '123 Main St, City, State',
    deliveryFee: 130,
    subtotal: 1200,
    total: 1330,
    items: [
      {
        id: '1',
        name: 'Maharaja Thali',
        quantity: 1,
        price: 700,
        image: '/placeholder.svg?height=80&width=80',
        includedItems: [
          'Mixed Vegetables',
          'Raita',
          'Sweet Dish',
          'Papad'
        ]
      }
    ]
  }
]

