export interface DishItem {
    name: string;
    price: number;
  }
  
  export interface MenuItem {
    name: string;
    dishes: DishItem[];
    image: string;
    category: string;
  }