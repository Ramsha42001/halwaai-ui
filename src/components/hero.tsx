import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Utensils, Percent, Truck } from 'lucide-react';

export default function Hero() {
    return (
        <div className="w-full min-h-[100vh] h-auto bg-background text-white px-4 sm:px-8 mt-[70px] md:mt-[50px] lg:mt-[70px] md:px-20 py-10">
            <div className="max-w-7xl mx-auto">
                {/* Main Hero Section */}
                <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between mb-16">
                    {/* Left Section */}
                    <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-wide font-poorStory">
                            Halwaai
                        </h1>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold">
                            The Thali Experience Like Never Before!
                        </h2>

                        {/* Mobile Thali Image */}
                        <div className="w-full h-auto md:hidden flex items-center justify-center">
                            <Image 
                                src="/images/combined3.png" 
                                alt="Traditional Indian Thali" 
                                width={300} 
                                height={300} 
                                className="object-contain"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
                            <Button 
                                className="bg-black hover:bg-black/90 text-white font-bold px-6 py-3 w-full sm:w-auto" 
                                size="lg"
                            >
                                Customize your Thali
                            </Button>
                            <Button 
                                className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold px-6 py-3 w-full sm:w-auto" 
                                variant="secondary" 
                                size="lg"
                            >
                                Order Predefined Thali
                            </Button>
                        </div>
                    </div>

                    {/* Right Section - Desktop Thali Image */}
                    <div className="w-full md:w-1/2 flex items-center justify-center mt-10 md:mt-0 hidden md:flex">
                        <Image 
                            src="/images/combined3.png" 
                            alt="Traditional Indian Thali" 
                            width={500} 
                            height={500} 
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* About Section */}
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-semibold mb-2 font-poorStory">About Halwaai</h3>
                    <p className="text-lg italic font-poppins">Crafting Flavors, Creating Memories—One Thali at a Time.</p>
                </div>

                {/* Feature Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Customize Box */}
                    <div className="bg-[#997864] p-6 rounded-lg text-center">
                        <div className="flex justify-center mb-4">
                            <Utensils className="w-12 h-12" />
                        </div>
                        <h4 className="font-semibold text-xl mb-3">Customize Your Thali, Your Way</h4>
                        <p className="text-sm">
                            Choose from thoughtfully curated categories to build a thali that uniquely yours. Perfect for special occasions, gatherings, or even everyday meals!
                        </p>
                    </div>

                    {/* Savings Box */}
                    <div className="bg-[#FFD700] text-black p-6 rounded-lg text-center">
                        <div className="flex justify-center mb-4">
                            <Percent className="w-12 h-12" />
                        </div>
                        <h4 className="font-semibold text-xl mb-3">More Thalis, More Savings</h4>
                        <p className="text-sm">
                            Truly satisfying meals that give you more plates—ideal for meal gatherings with family, friends, or for yourself!
                        </p>
                    </div>

                    {/* Delivery Box */}
                    <div className="bg-[#997864] p-6 rounded-lg text-center">
                        <div className="flex justify-center mb-4">
                            <Truck className="w-12 h-12" />
                        </div>
                        <h4 className="font-semibold text-xl mb-3">Delivered to Your Door</h4>
                        <p className="text-sm">
                            Never regional delicacies made fresh, that lets you savor authentic flavors at your doorstep, just when you need it!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

