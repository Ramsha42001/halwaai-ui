'use client'
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button";
import Hero from "@/components/hero";
import Header from '@/components/uheader/page'
import PredefinedThali from "@/components/upredefined/page";
import CustomizeThali from "@/components/usteps/page";
import Delivery from "@/components/udelivery/page";
import NgoPage from "@/components/ngo/page";
import Contact from "@/components/contactus/page";
import Footer from "@/components/footer/page";
import BottomNav from "@/components/bottomNav/page";
import { FaWhatsapp } from 'react-icons/fa'; // Importing WhatsApp icon
import { MenuItem } from '@/types/menu';
import { useRouter, useSearchParams } from 'next/navigation'; // For app directory structure and useSearchParams
import { menuItemService } from '@/services/api/menuItemService';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search parameters
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await menuItemService.getMenuItems();
        setMenuItems(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    const token = searchParams.get('token'); // Extract the token from the search parameters

    if (token) {
      localStorage.setItem('token', token);
      console.log('token', token) // Save the token directly
      router.push('/dashboard'); // Redirect to the dashboard or home page
    }
  }, [searchParams]);

  const socket = new WebSocket('ws://localhost:3000'); // Adjust the URL if needed

  socket.onopen = () => {
    console.log('Connected to WebSocket server');
    // Optionally send a message to the server
    socket.send('Hello Server!');
  };

  socket.onmessage = (event) => {
    console.log('Message from server:', event.data);
  };

  socket.onclose = () => {
    console.log('Disconnected from WebSocket server');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return (
    <>
      <Header />
      <BottomNav />
      <Hero />
      <PredefinedThali />
      <CustomizeThali />
      <Delivery />
      <NgoPage />
      <Contact />
      <Footer />

      {/* WhatsApp Icon */}
      {/* <a
        href="https://wa.me/yourwhatsappnumber" // Replace with your WhatsApp number or link
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-20 lg:bottom-5 right-5 bg-green-500 p-3 rounded-full text-white z-[9999] hover:bg-green-600 transition-all"
      >
        <FaWhatsapp className="h-6 w-6" />
      </a> */}
    </>
  );
}
