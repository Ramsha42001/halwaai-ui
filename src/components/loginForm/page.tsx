"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/services/store/authStore'
interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
    router.push('/')
  };


  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('authToken', result.user.uid);
      router.push("/");
    }
    catch (error) {
      console.error('Google login error:', error);
    }
  }


  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const uid = user.uid;
      console.log(uid);
      console.log('Google login success:', user);

      useAuthStore.getState().setUser(user);
      console.log('user', user.uid);
      localStorage.setItem('authToken', user.uid);

      router.push('/'); // redirect to a protected page
    } catch (error) {
      console.error('Google login error:', error);
    }
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2 text-black">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder=""
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-gray-300 bg-white"
          type="button"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="w-5 h-5" />
          Login with Google
        </Button>

        <Button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 my-[10px]"
          disabled={isLoading}
          onClick={handleLogin}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </Button>

        {/* <Button 
          type="button" 
          className="w-full bg-black hover:bg-gray-800"
          disabled={isLoading}
          onClick={(e) => {
            e.preventDefault();
            onSubmit({ email, password });
          }}
        >
          {isLoading ? "Logging in..." : "Login as admin"}
        </Button> */}
      </form>
    </div>
  );
};