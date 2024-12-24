import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "10,000+",
    description: "Thalis served monthly",
  },
  {
    label: "50+",
    description: "NGOs covered",
  },
  {
    label: "100%",
    description: "Packed with hygiene",
  },
];

export default function CustomizeThali() {
  return (
    <div className="min-h-screen bg-[#D84315] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl text-center font-poorStory mb-6 md:mb-12">
          Feeding Hope: Our Free Thali Program
        </h1>

        <h2 className="text-xl md:text-3xl font-medium mb-6 md:mb-12 font-poppins text-center">
          We believe that no one should go hungry. Through our Free Thali Program, we provide nutritious meals to those in need, spreading love and hope one plate at a time.
        </h2>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-accent border-[black] border-[3px] text-[#D84315] rounded-lg shadow-lg p-4"
            >
              <CardContent className="text-center font-poppins">
                <h3 className="text-3xl font-bold mb-2 text-[black]">{stat.label}</h3>
                <p className="text-lg font-semibold text-[#000080]">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Other Content */}
        <div className="flex flex-col justify-center items-center space-y-4 md:space-y-8">
          <img
            src="/images/ngo.png"
            alt="Thali with various Indian dishes"
            className="w-[100%] h-full"
          />
        </div>
      </div>
    </div>
  );
}
