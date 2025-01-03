"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export function LoginForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#FF4B26]">Halwaai</h1>
        <p className="text-gray-600 mt-2">Login to order your perfect thali</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 text-black">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder=""
            className="w-full"
          />
        </div>

        <div className="space-y-2 text-black">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder=""
            className="w-full"
          />
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-gray-300 bg-white"
        >
          <FcGoogle className="w-5 h-5" />
          Login with Google
        </Button>
          <Link href="/user">
        <Button type="submit" className="w-full bg-black hover:bg-gray-800 my-[10px]">
          Login as user
        </Button>


        </Link>

        <Link href="/admin">
        <Button type="submit" className="w-full bg-black hover:bg-gray-800">
          Login as admin
        </Button>

        
        </Link>
      </form>
    </div>
  );
}