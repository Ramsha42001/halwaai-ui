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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 text-black flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-[90px] overflow-hidden">
        <div className="w-full max-w-[350px] sm:max-w-sm md:max-w-[900px] lg:max-w-[1000px] bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex max-h-[calc(100vh-120px)]">
          {/* Image Section - Hidden on mobile, visible on larger screens */}
          <div className="w-1/2 relative hidden md:block overflow-hidden">
            <Image
              src={signupImage}
              alt="Indian thali"
              className="w-full h-full object-cover"
              loading="eager"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 0vw, 50vw"
              priority
            />
            {/* Overlay for better text contrast if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 flex flex-col">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 md:p-8 lg:p-12 min-h-full flex items-center">
                <div className="w-full">
                  <SignupForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}