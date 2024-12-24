import {MapPin,Clock,Truck} from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Home() {
  return (
    <>
      <div className="flex flex-row width-[100%] min-h-auto h-[90vh] bg-foreground text-[black] px-20">
        <div className="w-[50%] h-[90vh] flex flex-col items-start justify-center py-10">
          <h2 className="font-poppins font-semibold text-4xl md:text-4xl flex items-center gap-2 my-5">
            Delivery Information
          </h2>
          <h4 className="flex flex-row align-center gap-2 my-5 text-2xl font-thin"> <MapPin className="w-7 h-7 mt-1 text-current" /> We deliver to all areas within and near Bhilwara, Rajasthan</h4>
          <h4 className="flex flex-row align-center gap-2 my-5 text-2xl font-thin"> <Clock  className="w-7 h-7 mt-1 text-current" />Delivery schedule: 7 times a week</h4>
          <h4 className="flex flex-row align-center gap-2 my-5 text-2xl font-thin"> <Truck  className="w-6 h-6 mt-1 text-current" />Delivery at very reasonable price</h4>
          <div className="flex gap-4 my-10">
              <Button className="flex-1 bg-black text-white hover:bg-white/90">
                Customize your Thali
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-accent text-[black] hover:bg-white/90 border-[black]"
              >
                Order Predefined Thali
              </Button>
            </div>
        </div>
        <div className="w-[50%] h-[90vh] flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-4xl font-poorStory">Delivery Area</h2>
          <Image src="/images/deliveryArea.png" alt="deliveryArea" width={400} height={400}/>
        </div>
      </div>
    </>
  );
}

