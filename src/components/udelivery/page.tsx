'use client'

import { MapPin, Clock, Truck } from 'lucide-react';
import Image from "next/image";
import { Button } from "../ui/button";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-foreground text-black px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      <div className="w-full lg:w-1/2 flex flex-col items-start justify-center py-8 lg:py-10">
        <h2 className="font-poppins font-semibold text-3xl sm:text-4xl flex items-center gap-2 mb-6">
          Delivery Information
        </h2>
        <div className="space-y-4 sm:space-y-6">
          <h4 className="flex items-start gap-2 text-lg sm:text-xl md:text-2xl font-thin">
            <MapPin className="w-6 h-6 mt-1 flex-shrink-0 text-current" />
            <span>We deliver to all areas within and near Bhilwara, Rajasthan</span>
          </h4>
          <h4 className="flex items-start gap-2 text-lg sm:text-xl md:text-2xl font-thin">
            <Clock className="w-6 h-6 mt-1 flex-shrink-0 text-current" />
            <span>Delivery schedule: 7 times a week</span>
          </h4>
          <h4 className="flex items-start gap-2 text-lg sm:text-xl md:text-2xl font-thin">
            <Truck className="w-6 h-6 mt-1 flex-shrink-0 text-current" />
            <span>Delivery at very reasonable price</span>
          </h4>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-black text-white hover:bg-white/90">
            Customize your Thali
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto bg-accent text-black hover:bg-white/90 border-black"
          >
            Order Predefined Thali
          </Button>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center mt-8 lg:mt-0">
        <h2 className="text-3xl sm:text-4xl font-poorStory mb-4">Delivery Area</h2>
        <div className="relative w-full max-w-md aspect-square">
          <Image 
            src="/images/deliveryArea.png" 
            alt="deliveryArea" 
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  );
}

