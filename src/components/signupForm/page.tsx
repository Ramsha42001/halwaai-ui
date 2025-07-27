"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { storageService } from "@/utils/storage";
import { Skeleton } from "@/components/ui/skeleton";
import { ERROR_MESSAGES } from "@/utils/errorMessage";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ChefHat, User, UserPlus, ArrowRight } from "lucide-react";

export const SignupForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const uid = user.uid;
      console.log(uid);
      console.log('Google Signup success:', user);

      storageService.setAuthToken(user.uid);

      router.push('/'); // redirect to a protected page
    } catch (error: any) {
      console.error('Google signup error:', error);
      const errorMessage = ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || error.message || 'An error occurred during signup.';
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('signing up')

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    console.log("Attempting to sign up with:", { firstName, lastName, email, password });

    setLoading(true);
    setError(null);

    try {
      // Proceed with Firebase signup
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('User created successfully!');
      router.push("/login"); // Redirect after successful signup
    } catch (error: any) {
      console.error("Signup error:", error); // Log the error for debugging
      const errorMessage = ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || error.message || 'An error occurred during signup.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced skeleton loader with mobile optimization
  if (loading || isGoogleLoading) {
    return (
      <div className="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
          </div>
          <Skeleton className="h-8 sm:h-10 w-32 sm:w-40 mx-auto mb-2 sm:mb-3 bg-gray-200" />
          <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 mx-auto bg-gray-200" />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200 rounded-xl" />
            </div>
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 sm:h-4 w-20 sm:w-28 bg-gray-200" />
              <Skeleton className="h-10 w-full bg-gray-200 rounded-xl" />
            </div>
          ))}
          <div className="flex gap-3 sm:gap-4 pt-2">
            <Skeleton className="h-10 w-1/2 bg-gray-200 rounded-xl" />
            <Skeleton className="h-10 w-1/2 bg-gray-200 rounded-xl" />
          </div>
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
            Join Halwaai
          </span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-poppins px-2 sm:px-0">
          Create your account to order perfect thalis
        </p>
      </motion.div>

      {/* Error/Success Message */}
      {(error || message) && (
        <motion.div
          className={`${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
            } border px-3 sm:px-4 py-3 rounded-xl mb-4 sm:mb-6 text-xs sm:text-sm`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          variants={itemVariants}
        >
          {error || message}
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        onSubmit={handleSignup}
        className="space-y-4 sm:space-y-6"
        variants={itemVariants}
      >
        {/* Name Fields */}
        <motion.div className="grid grid-cols-2 gap-3 sm:gap-4" variants={itemVariants}>
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-gray-700 font-medium flex items-center space-x-2 text-sm sm:text-base"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
              <span>First Name</span>
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              className="w-full py-2.5 sm:py-3 text-sm sm:text-base border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 touch-manipulation"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-gray-700 font-medium flex items-center space-x-2 text-sm sm:text-base"
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
              <span>Last Name</span>
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              className="w-full py-2.5 sm:py-3 text-sm sm:text-base border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 touch-manipulation"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </motion.div>

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
              placeholder="johndoe@example.com"
              className="w-full pl-9 sm:pl-10 py-2.5 sm:py-3 text-sm sm:text-base border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 touch-manipulation"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            <span>Create Password</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 touch-manipulation"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

        {/* Confirm Password Field */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <Label
            htmlFor="confirmPassword"
            className="text-gray-700 font-medium flex items-center space-x-2 text-sm sm:text-base"
          >
            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
            <span>Confirm Password</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 touch-manipulation"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Lock className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-md touch-manipulation"
            >
              {showConfirmPassword ?
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> :
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              }
            </button>
          </div>
        </motion.div>

        {/* Password Requirements */}
        <motion.div className="text-xs text-gray-500 space-y-1" variants={itemVariants}>
          <p>Password must be at least 6 characters long</p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div className="space-y-3 sm:space-y-4 pt-2" variants={itemVariants}>
          {/* Signup Button */}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold py-3 sm:py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base disabled:opacity-50 touch-manipulation"
            disabled={loading || isGoogleLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            {!loading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Google Signup */}
          <motion.button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base disabled:opacity-50 touch-manipulation"
            disabled={loading || isGoogleLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{isGoogleLoading ? 'Creating Account...' : 'Continue with Google'}</span>
          </motion.button>
        </motion.div>
      </motion.form>

      {/* Login Link */}
      <motion.div
        className="text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200"
        variants={itemVariants}
      >
        <p className="text-gray-600 font-poppins text-sm sm:text-base">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 touch-manipulation"
          >
            Sign in here
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};