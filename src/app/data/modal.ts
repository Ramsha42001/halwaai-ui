import { ModalConfig } from "@/app/types/modal";

export const modalData: ModalConfig[] = [
  {
    title: "Welcome Offer!",
    description: "Get 20% off on your first order with code WELCOME20",
    showOnLoad: true,
    delay: 0,
    buttonText: "Claim Offer",
  },
  {
    title: "Special Discount",
    description: "Limited time offer: Free delivery on orders above ₹500",
    showOnLoad: false,
    delay: 5000,
    buttonText: "Order Now",
  },
];