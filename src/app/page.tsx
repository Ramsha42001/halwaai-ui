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

export default function Home() {
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
      <a
        href="https://wa.me/yourwhatsappnumber" // Replace with your WhatsApp number or link
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-20 lg:bottom-5 right-5 bg-green-500 p-3 rounded-full text-white z-[9999] hover:bg-green-600 transition-all"
      >
        <FaWhatsapp className="h-6 w-6" />
      </a>
    </>
  );
}
