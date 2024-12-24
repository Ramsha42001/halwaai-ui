import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: "/images/thali.png",
    alt: "Thali icon",
    text: "1. Choose an existing thali/create your own",
  },
  {
    icon: "/images/items.png",
    alt: "Menu icon",
    text: "2. Select items present in the menu and click next",
  },
  {
    icon: "/images/address.png",
    alt: "Address icon",
    text: "3. Add Billing Address",
  },
  {
    icon: "/images/delivery.png",
    alt: "Checkout icon",
    text: "4. Proceed to Checkout",
  },
  {
    icon: "/images/billing.png",
    alt: "Payment icon",
    text: "5. Add Payment details",
  },
  {
    icon: "/images/delivery.png",
    alt: "Delivery icon",
    text: "6. Enjoy delicious Thali delivered to your home.",
  },
];

export default function CustomizeThali() {
  return (
    <div className="min-h-screen bg-[#D84315] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl text-center font-poorStory mb-12">
          Customize Your Thali
        </h1>

        <h2 className="text-2xl md:text-3xl font-medium mb-12 font-poppins text-left">
          Craft Your Perfect Thali Experience
        </h2>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Left Section: Steps */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className={`bg-white text-[#D84315] p-4 rounded-lg w-full ${
                    index === steps.length - 1 ? "border-2 border-white" : ""
                  }`}
                >
                  <CardContent className="flex flex-col items-center space-y-2 p-2 font-poppins">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      {step.icon ? (
                        <Image
                          src={step.icon}
                          alt={step.alt}
                          width={24}
                          height={24}
                          className="text-white"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-white rounded-full" />
                      )}
                    </div>
                    <p className="text-center text-sm">{step.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Section: Image and Buttons */}
          <div className="flex flex-col justify-center items-center space-y-8">
            <Image
              src="/images/thali1.png"
              alt="Thali with various Indian dishes"
              width={500}
              height={500}
              className="rounded-full"
            />
            <div className="flex gap-4">
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
        </div>
      </div>
    </div>
  );
}
