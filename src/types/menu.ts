export interface DishItem {
    name: string;
    price: number;
  }
  
  export interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    category: {
      _id: string;
      name: string;
    };
    requiredThali?: string;
  }