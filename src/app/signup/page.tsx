"use client";

import { SignupForm } from "@/components/signupForm/page"; // Import the type
import Header from "@/components/uheader/page";
import Image from 'next/image';
import signupImage from "../../../public/images/signupImage.png";
import { useState } from "react"; // Import useState
import { useRouter } from 'next/navigation';
import authService from "@/services/api/authService";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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
    <div className="min-h-screen bg-[#FFF5F5] text-[black] flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 bg-[#FFF5F5] flex items-center justify-center p-4 pt-[90px] overflow-hidden">
        <div className="w-full max-w-[1000px] bg-white rounded-3xl overflow-hidden shadow-xl flex max-h-[calc(100vh-120px)]">
          <div className="w-1/2 relative hidden md:block overflow-hidden">
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
          <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto">
            <SignupForm isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}