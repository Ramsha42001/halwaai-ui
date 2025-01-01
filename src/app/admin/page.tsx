"use client"

import { Button } from "@/components/ui/button";
import Hero  from "@/components/hero"
import { useRouter } from "next/navigation";


export default function MenuPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fff5f5] text-[black] flex-column">
      <div className="bg-[#F4CE14] w-[full] h-[70px] fixed top-[70px] left-0 right-0 flex items-center justify-end">
        <Button onClick={() => router.push('/admin/menuItems')} className="w-auto h-[40px] bg-[white] text-black border border-black rounded-md p-2 mr-[10px]">
          <span>Go to dashboard</span>
        </Button>
      </div>
      <Hero />
    </div>
  );
}
