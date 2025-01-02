"use client";

import { SignupForm } from "@/components/signupForm/page";
import Header from "@/components/uheader/page";
import signupImage from "../../../public/images/signupImage.png"

export default function Home() {
  return (
    <div className="min-h-screen bg-foreground text-[black] flex-column">
        <Header />
        <main className="min-h-screen bg-[#FFF5F5] flex items-center justify-center h-auto mt-[70px] overflow-y-hidden">
      <div className="w-full max-w-[1000px] bg-white rounded-3xl overflow-hidden shadow-xl flex">
        <div className="w-1/2 relative hidden md:block">
          <img
            src={signupImage.src}
            alt="Indian thali"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <SignupForm />
        </div>
      </div>
    </main>
    </div>
    
  );
}