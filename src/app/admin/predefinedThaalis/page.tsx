"use client";
import SubHeader from "@/components/sub-header";
import Header from '@/components/uheader/page'
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CustomPopup } from "@/components/popup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/image-upload";
import { useState } from "react";
import { ThaliCard } from "@/components/thaaliComponent/page";
import { menuItems } from "@/data/menu-items";

export default function PredefinedThaalis() {
  const [isAddThaliOpen, setIsAddThaliOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-[#fff5f5] ">
        <SubHeader />
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}

        <div className="flex flex-row justify-between items-start mb-8">
          <h1 className="text-3xl text-black font-bold mb-2">Your Predefined Thalis</h1>
          <Button 
            onClick={() => setIsAddThaliOpen(true)}
            className="mt-4 bg-black hover:bg-gray-800 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Thali
          </Button>
        </div>

        {/* Thalis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <ThaliCard
              key={index}
              title={item.name}
              items={item.dishes}
              image={item.image}
              onEdit={() => console.log(`Edit ${item.name}`)}
              onDelete={() => console.log(`Delete ${item.name}`)}
            />
          ))}
        </div>

        {/* Add Thali Popup */}
        <CustomPopup
          isOpen={isAddThaliOpen}
          onClose={() => setIsAddThaliOpen(false)}
          title="Add New Thali"
          className="sm:max-w-[500px] bg-[#fff5f5] text-black"
          footer={
            <Button 
              className="bg-black text-white hover:bg-gray-800" 
              onClick={() => setIsAddThaliOpen(false)}
            >
              Add Thali
            </Button>
          }
        >
          <div className="space-y-4">
            {/* Thali Name */}
            <div className="space-y-2">
              <Label className="text-black">Thali Name</Label>
              <Input 
                placeholder="Enter thali name"
                className="bg-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-black">Description</Label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-white"
                placeholder="Enter thali description"
              />
            </div>

            {/* Base Price */}
            <div className="space-y-2">
              <Label className="text-black">Base Price (₹)</Label>
              <Input 
                type="number"
                placeholder="Enter base price"
                className="bg-white"
              />
            </div>

            {/* Thali Image */}
            <div className="space-y-2">
              <Label className="text-black">Thali Image</Label>
              <ImageUpload
                value={selectedImage}
                onChange={setSelectedImage}
              />
            </div>
          </div>
        </CustomPopup>
      </div>
    </div>
  );
}
