import { Button } from "@/components/ui/button";
import Hero from "@/components/hero";
import Header from '@/components/uheader/page'
import PredefinedThali from "@/components/upredefined/page";
import CustomizeThali from "@/components/usteps/page";
import Delivery from "@/components/udelivery/page";
import NgoPage from "@/components/ngo/page";
import Contact from "@/components/contactus/page";
import Footer from "@/components/footer/page";

export default function Home() {
  return (
    <>
    <Header />
     <Hero />
     <PredefinedThali />
     <CustomizeThali />
     <Delivery />
     <NgoPage />
     <Contact />
     <Footer />
    </>
    
  );
}
