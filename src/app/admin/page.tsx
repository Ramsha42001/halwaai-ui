"use client"

import { Button } from "@/components/ui/button";
import Hero from "@/components/hero"
import PredefinedThali from "@/components/upredefined/page";
import CustomizeThali from "@/components/usteps/page";
import Delivery from '@/components/udelivery/page'
import NgoPage from '@/components/contactus/page'
import Contact from "@/components/contactus/page";
import Footer from "@/components/footer/page";
import { useRouter } from "next/navigation";
import withAuth, { withAdminAuth } from "@/utils/withAuth";

function MenuPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fff5f5] text-[black] flex-column pb-[20px]">
      <div className="bg-[#F4CE14] w-[full] h-[75px] fixed top-[70px] left-0 right-0 flex items-center justify-end p-4">

      </div>
      <Hero />
      <PredefinedThali />
      <CustomizeThali />
      <Delivery />
      <NgoPage />
      <Contact />
      <Footer />
    </div>
  );
}

export default withAdminAuth(MenuPage)
