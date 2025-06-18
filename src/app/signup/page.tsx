"use client";

import { SignupForm} from "@/components/signupForm/page"; // Import the type
import Header from "@/components/uheader/page";
import Image from 'next/image';
import signupImage from "../../../public/images/signupImage.png";
import { useState } from "react"; // Import useState
import { useRouter } from 'next/navigation';
import authService from "@/services/api/authService";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

   const handleSignup = async (credentials: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => { 
    try {
      await authService.signup(credentials.email, credentials.password, credentials.firstName, credentials.lastName);
      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };


  
  return (
    <div className="min-h-screen bg-foreground text-[black] flex-column">
      <Header />
      <main className="min-h-screen bg-[#FFF5F5] flex items-center justify-center h-auto mt-[70px] overflow-y-hidden">
        <div className="w-full max-w-[1000px] bg-white rounded-3xl overflow-hidden shadow-xl flex">
          <div className="w-1/2 relative hidden md:block">
            <Image
              src={signupImage}
              alt="Indian thali"
              className="w-full h-full object-cover"
              loading="eager"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <SignupForm onSubmit={handleSignup} isLoading={isLoading} /> {/* Pass props */}
          </div>
        </div>
      </main>
    </div>
  );
}