export interface MenuItems {
    item: string;
    name: string;
    quantity: number;
    price: number;
}
export interface PredefinedThali {
    _id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    menuItems: MenuItems[];
}
