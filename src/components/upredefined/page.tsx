'use client';

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { IceCreamBowlIcon as Bowl, CroissantIcon as Bread, IceCream2, UtensilsCrossed } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Link from 'next/link';
import predefinedThaliService from '@/services/api/predefinedThaliService';
import { useState, useEffect } from 'react';
import type { PredefinedThali } from '@/types/predefinedThali';
import { menuItems } from "@/data/menu-items";
import { ThaliCard } from "../thaaliComponent/page";
import { menuItemService } from "@/services/api";
import { cartService } from "@/services/api/cartService";

export default function PredefinedThali() {
  const [predefinedThali, setPredefinedThali] = useState<PredefinedThali[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);

  const selectedThali = JSON.parse(localStorage.getItem('selectedThali'));
  console.log(selectedThali)

  const thaliToCart = async () => {
    const payload = {
      thaaliTitle: selectedThali.title,
      menuItems: selectedThali.items.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      thaaliTotalPrice: selectedThali.price,
      thaliquantity: selectedThali.quantity
    }

    console.log(payload); // Log the entire payload to see its structure
    await cartService.addToCart(payload);
  }

  useEffect(() => {
    const fetchPredefinedThalis = async () => {
      try {
        const response = await predefinedThaliService.getPredefinedThali();
        setPredefinedThali(response);
        console.log(response)
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setLoading(false);
      }
    };

    fetchPredefinedThalis();
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await menuItemService.getMenuItems();
        console.log('API Response:', response);

        // Filter menu items based on predefined thali items
        const filteredItems = response.filter(menuItem =>
          predefinedThali.some(thali =>
            thali.menuItems.some(item => item._id === menuItem._id)
          )
        );

        setFilteredMenuItems(filteredItems);

      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch menu items'));
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [predefinedThali]);




  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading thalis</div>;
  }

  return (
    <>
      <div id="predefined" className="min-h-screen bg-[#FFF5F5] py-8 px-4 sm:py-16">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl text-center font-poorStory mb-8 sm:mb-12 text-[black]">
            Check out our Pre-defined Thalis
          </h1>

          <div className="mt-16 sm:mt-32 relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="flex justify-center items-center min-w-[100%] h-auto min-h-[90vh]">
                {
                  predefinedThali?.map((thali, index) => (
                    <CarouselItem key={thali._id} className="flex justify-center md:basis-1/2 lg:basis-1/3 h-full">
                      <ThaliCard
                        key={thali._id}
                        _id={thali._id}
                        title={thali.name}
                        description={thali.description}
                        items={thali.menuItems.map(item => ({
                          _id: item._id, // Ensure this is the correct property for the ID
                          name: item.name,
                          price: item.price,
                          quantity: item.quantity,
                        }))} // This creates an array of items
                        image={thali.image}
                        price={thali.price}
                        showButton={false}
                      />
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>

          <div className="flex justify-center ">
            <Link
              href={localStorage.getItem('authToken') ? '/user/cart' : '/login'}
            >
              <Button size="lg" className="bg-black text-white hover:bg-black/90"
                onClick={thaliToCart}
              >
                Go to Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
