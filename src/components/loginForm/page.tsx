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
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ChefHat, Shield, User, ArrowRight } from "lucide-react";

interface LoginFormProps {
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isLoading }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailLoginLoading, setIsEmailLoginLoading] = useState(false);
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false);
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);
  const [isAdminLoginLoading, setIsAdminLoginLoading] = useState(false);
  const router = useRouter();

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

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

      useAuthStore.getState().setUser(user);
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
      const adminEmail = 'admin.halwai@gmail.com';
      const adminPassword = 'admin123';

      const response = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const user = response.user;

      storageService.setAuthToken(user.uid);
      useAuthStore.getState().setUser(user);
      router.push('/');
    } catch (error: any) {
      console.error('Admin login error:', error);
      const errorMessage = ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || error.message || 'An error occurred during admin login.';
      setError(errorMessage);
    } finally {
      setIsAdminLoginLoading(false);
    }
  };

  // Enhanced skeleton loader with mobile optimization
  if (isEmailLoginLoading || isGoogleLoginLoading || isAdminLoginLoading) {
    return (
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
          </div>
          <Skeleton className="h-8 sm:h-10 w-28 sm:w-32 mx-auto mb-2 sm:mb-3 bg-gray-200" />
          <Skeleton className="h-3 sm:h-4 w-40 sm:w-48 mx-auto bg-gray-200" />
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Form skeletons */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-200" />
              <Skeleton className="h-11 sm:h-12 w-full bg-gray-200 rounded-xl" />
            </div>
          ))}

          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-11 sm:h-12 w-full bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center mb-6 sm:mb-8" variants={itemVariants}>
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
          <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-poorStory mb-2 leading-tight">
          <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Welcome Back
          </span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-poppins px-2 sm:px-0">
          Login to order your perfect thali
        </p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-xl mb-4 sm:mb-6 text-xs sm:text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          variants={itemVariants}
        >
          {error}
          {error.includes('Too many failed login attempts') && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-xs sm:text-sm font-medium mb-2">Try these alternatives:</p>
              <ul className="text-xs sm:text-sm space-y-1">
                <li>• Use Google login (recommended)</li>
                <li>• Wait 15-30 minutes and try again</li>
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        className="space-y-4 sm:space-y-6"
        onSubmit={handleLogin}
        variants={itemVariants}
      >
        {/* Email Field */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <Label
            htmlFor="email"
            className="text-gray-700 font-medium flex items-center space-x-2 text-sm sm:text-base"
          >
            <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
            <span>Email</span>
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full pl-9 sm:pl-10 py-2.5 sm:py-3 text-sm sm:text-base border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-black touch-manipulation"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isPasswordResetLoading}
            />
            <Mail className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
        </motion.div>

        {/* Password Field */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <Label
            htmlFor="password"
            className="text-gray-700 font-medium flex items-center space-x-2 text-sm sm:text-base"
          >
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
            <span>Password</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-black touch-manipulation"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isPasswordResetLoading}
            />
            <Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-md touch-manipulation"
            >
              {showPassword ?
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> :
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              }
            </button>
          </div>
        </motion.div>

        {/* Login Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold py-3 sm:py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50 touch-manipulation"
            disabled={isPasswordResetLoading || isEmailLoginLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{isEmailLoginLoading ? 'Signing In...' : 'Sign In'}</span>
            {!isEmailLoginLoading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div className="relative" variants={itemVariants}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </motion.div>

        {/* Google Login */}
        <motion.div variants={itemVariants}>
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md text-black text-sm sm:text-base disabled:opacity-50 touch-manipulation"
            disabled={isPasswordResetLoading || isGoogleLoginLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{isGoogleLoginLoading ? 'Signing In...' : 'Continue with Google'}</span>
          </motion.button>
        </motion.div>
      </motion.form>

      {/* Sign Up Link */}
      <motion.div
        className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200"
        variants={itemVariants}
      >
        <p className="text-gray-600 font-poppins text-sm sm:text-base">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 touch-manipulation"
          >
            Sign up here
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};