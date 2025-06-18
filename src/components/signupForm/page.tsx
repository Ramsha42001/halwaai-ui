"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import authService from "@/services/api/authService";
import { useRouter } from 'next/navigation';


interface SignupFormProps {
  onSubmit: (credentials: { firstName: string; lastName: string; email: string; password: string; confirmPassword: string; }) => Promise<void>;
  isLoading: boolean;
}





export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isLoading }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const googleSignup = async () => {
    try {
      window.location.href = 'http://localhost:3000/api/gauth/google';
    } catch (error) {
      console.error("Google signup error:", error);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ firstName, lastName, email, password, confirmPassword });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#FF4B26]">Halwaai</h1>
        <p className="text-gray-600 mt-2">Signup to order your perfect thali</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              className="w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              className="w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="johndoe@example.com"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Create Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            className="w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-4 pt-2">
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2 border-gray-300 bg-white"
            type="button" // Important: Prevent form submission on Google button click
            onClick={googleSignup}
          >
            <FcGoogle className="w-5 h-5" />
            Signup with Google
          </Button>
          <Button type="submit" className="flex-1 bg-black hover:bg-gray-800" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>
        </div>
      </form>
    </div>
  );
};