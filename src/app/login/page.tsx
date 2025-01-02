"use client";

import { LoginForm } from "@/components/loginForm/page"
import loginImage from "../../../public/images/loginImage.png"
import { useEffect, useState } from "react"; // Import useState and useEffect
import Header from "@/components/uheader/page";

export default function Home() {
    const [isClient, setIsClient] = useState(false); // State for tracking client-side rendering
    useEffect(() => {
        setIsClient(true); // Set isClient to true after hydration
      }, []);
  return (
    <div className="min-h-screen bg-foreground text-[black] flex-column">
        <Header />
        <main className="min-h-screen bg-foreground flex items-center justify-center p-4 mt-[70px]">
      <div className="w-full max-w-[1000px] bg-white rounded-3xl overflow-hidden shadow-xl flex">
        <div className="w-1/2 relative hidden md:block">
          <img
            src={loginImage.src}
            alt="Indian thali"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <LoginForm />
        </div>
      </div>
    </main>
    </div>
    
  );
}
