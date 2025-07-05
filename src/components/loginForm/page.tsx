"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { storageService } from "@/utils/storage";
import { useAuthStore } from '@/services/store/authStore'
import { ERROR_MESSAGES } from "@/utils/errorMessage";

interface LoginFormProps {
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isLoading }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isEmailLoginLoading, setIsEmailLoginLoading] = useState(false);
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false);
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);
  const [isAdminLoginLoading, setIsAdminLoginLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoginLoading(true);
    setError(null);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;

      storageService.setAuthToken(user.uid);
      useAuthStore.getState().setUser(user);
      router.push('/');
    }
    catch (error: any) {
      console.error('login error:', error);
      const errorMessage = ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || error.message || 'An error occurred during login.';
      setError(errorMessage);
    } finally {
      setIsEmailLoginLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoginLoading(true);
    setError(null);

    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const uid = user.uid;
      console.log(uid);
      console.log('Google login success:', user);

      useAuthStore.getState().setUser(user);
      console.log('user', user.uid);
      storageService.setAuthToken(user.uid);

      router.push('/');
    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMessage = ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || 'An error occurred during Google login.';
      setError(errorMessage);
    } finally {
      setIsGoogleLoginLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setIsPasswordResetLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setError('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      const errorMessage = ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || 'Failed to send password reset email. Please try again.';
      setError(errorMessage);
    } finally {
      setIsPasswordResetLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdminLoginLoading(true);
    setError(null);

    try {
      // Admin credentials (you should move these to environment variables)
      const adminEmail = 'admin.halwai@gmail.com';
      const adminPassword = 'admin123';

      const response = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const user = response.user;

      // Store auth token
      storageService.setAuthToken(user.uid);

      // Update auth store
      useAuthStore.getState().setUser(user);

      // Navigate to admin dashboard or home page
      router.push('/');
    } catch (error: any) {
      console.error('Admin login error:', error);
      const errorMessage = ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || error.message || 'An error occurred during admin login.';
      setError(errorMessage);
    } finally {
      setIsAdminLoginLoading(false);
    }
  };

  // Show skeleton loader when any loading state is active
  if (isEmailLoginLoading || isGoogleLoginLoading || isAdminLoginLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-48 mx-auto mb-2 bg-gray-300" />
          <Skeleton className="h-4 w-64 mx-auto bg-gray-300" />
        </div>

        <div className="space-y-6">
          {/* Email field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12 bg-gray-300" />
            <Skeleton className="h-10 w-full bg-gray-300" />
          </div>

          {/* Password field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-gray-300" />
            <Skeleton className="h-10 w-full bg-gray-300" />
            <div className="text-right">
              <Skeleton className="h-4 w-32 ml-auto bg-gray-300" />
            </div>
          </div>

          {/* Google login button skeleton */}
          <Skeleton className="h-10 w-full bg-gray-300" />

          {/* Login button skeleton */}
          <Skeleton className="h-10 w-full bg-gray-300" />

          {/* Admin login button skeleton */}
          <Skeleton className="h-10 w-full bg-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#FF4B26]">Halwaai</h1>
        <p className="text-gray-600 mt-2">Login to order your perfect thali</p>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
          {error.includes('Too many failed login attempts') && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-sm font-medium mb-2">Try these alternatives:</p>
              <ul className="text-sm space-y-1">
                <li>• Use Google login (recommended)</li>
                <li>• Wait 15-30 minutes and try again</li>
              </ul>
            </div>
          )}
        </div>
      )}
      <form className="space-y-6" onSubmit={handleLogin}>
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
            disabled={isPasswordResetLoading}
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
            disabled={isPasswordResetLoading}
          />
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-gray-300 bg-white"
          type="button"
          onClick={handleGoogleLogin}
          disabled={isPasswordResetLoading}
        >
          <FcGoogle className="w-5 h-5" />
          Login with Google
        </Button>

        <Button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 my-[10px]"
          disabled={isPasswordResetLoading}
        >
          Log in
        </Button>
      </form>
    </div>
  );
};